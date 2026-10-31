import type { ComputedRef, Ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { PDF_TO_CSS_UNITS, TITLE_TOP_MARGIN } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/constants'
import type { DestTarget, OutlineNode, PdfCoreContext, RawOutlineItem } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/types'

/**
 * 解析书签目标对应的页码与页内位置
 *
 * @param doc  文档代理
 * @param dest 书签目标（命名目标字符串或显式目标数组）
 */
const resolveDest = async (doc: PDFDocumentProxy, dest: string | unknown[] | null): Promise<DestTarget | null> => {
  if (!dest) return null
  try {
    const target = typeof dest === 'string' ? await doc.getDestination(dest) : dest
    if (!Array.isArray(target) || !target.length) return null
    const first = target[0]
    let pageNo: number
    if (typeof first === 'number') {
      pageNo = first + 1
    } else if (first && typeof first === 'object') {
      pageNo = (await doc.getPageIndex(first as Parameters<PDFDocumentProxy['getPageIndex']>[0])) + 1
    } else {
      return null
    }
    // XYZ 等带坐标的目标：换算为视口纵向偏移，跳转时精准落在章节标题处
    let offset = 0
    const position = target[1] as { left?: number; top?: number } | undefined
    if (position && typeof position === 'object' && Number.isFinite(position.top)) {
      const page = await doc.getPage(pageNo)
      // 偏移统一以 CSS px 口径返回（与 pageSizeAt 一致），跳转计算无需二次换算
      const viewport = page.getViewport({ scale: PDF_TO_CSS_UNITS })
      const [, vy] = viewport.convertToViewportPoint(position.left ?? 0, position.top ?? 0)
      offset = Math.max(0, Math.min(viewport.height, vy))
    }
    return { page: pageNo, offset }
  } catch (error) {
    console.error('PDF目录目标解析失败:', error)
  }
  return null
}

/**
 * 在指定页内按标题文本定位纵向偏移（书签目标未记录坐标时的兜底）
 *
 * @param doc    文档代理
 * @param pageNo 页码
 * @param title  目录标题
 * @returns 页内偏移（scale=1 的 px）；找不到返回 -1
 */
const locateTitleOffset = async (doc: PDFDocumentProxy, pageNo: number, title: string): Promise<number> => {
  try {
    const page = await doc.getPage(pageNo)
    const content = await page.getTextContent()
    // 只依赖 str 与 transform 两个字段，避免深路径类型依赖
    const items = (content.items as unknown[]).filter(
      (item): item is { str: string; transform: number[] } => typeof (item as { str?: unknown }).str === 'string'
    )
    const normalize = (text: string) => text.replace(/\s+/g, '')
    const target = normalize(title)
    // 拼接全文定位标题起点，再映射回所属文本项的坐标
    let joined = ''
    const starts: number[] = []
    for (const item of items) {
      starts.push(joined.length)
      joined += normalize(item.str)
    }
    const at = joined.indexOf(target)
    if (at < 0) return -1
    let hit = 0
    for (let index = 0; index < starts.length; index++) {
      if (starts[index] <= at) hit = index
      else break
    }
    const viewport = page.getViewport({ scale: PDF_TO_CSS_UNITS })
    const [, vy] = viewport.convertToViewportPoint(items[hit].transform[4], items[hit].transform[5])
    // transform[5] 是文字基线位置，字形上伸部分在基线之上；
    // 直接滚到基线会把标题上半截切出视口，需再减去字号高度（transform 为原始单位，随视口一并换算）
    const fontSize = (Math.abs(items[hit].transform[3]) || Math.abs(items[hit].transform[0]) || 12) * PDF_TO_CSS_UNITS
    return Math.max(0, Math.min(viewport.height, vy - fontSize - TITLE_TOP_MARGIN))
  } catch (error) {
    console.error('PDF目录标题定位失败:', error)
    return -1
  }
}

/**
 * 目录模块返回值
 */
export interface OutlineFeature {
  outlineNodes: Ref<OutlineNode[]>
  outlineLoaded: Ref<boolean>
  outlineLoading: Ref<boolean>
  visibleOutline: ComputedRef<OutlineNode[]>
  toggleOutline: (node: OutlineNode) => void
  handleOutlineClick: (node: OutlineNode) => Promise<void>
  loadOutline: (doc: PDFDocumentProxy) => Promise<void>
  /** 文档销毁时清空目录数据 */
  reset: () => void
}

/**
 * 创建目录（文档大纲）功能模块
 *
 * @param ctx 核心上下文
 */
export const createOutlineFeature = (ctx: PdfCoreContext): OutlineFeature => {
  const { scrollToPage, getDoc, isCurrentDoc } = ctx

  const outlineNodes = ref<OutlineNode[]>([])
  const outlineLoaded = ref(false)
  const outlineLoading = ref(false)

  /**
   * 按展开状态拍平的目录行，便于用单层 v-for 渲染树形结构
   */
  const visibleOutline = computed(() => {
    const rows: OutlineNode[] = []
    const walk = (nodes: OutlineNode[]) => {
      for (const node of nodes) {
        rows.push(node)
        if (node.open && node.children.length) walk(node.children)
      }
    }
    walk(outlineNodes.value)
    return rows
  })

  /**
   * 展开/收起目录节点
   *
   * @param node 目录节点
   */
  const toggleOutline = (node: OutlineNode) => {
    node.open = !node.open
  }

  /**
   * 加载文档目录（大纲）；无书签时置空并标记已加载
   *
   * @param doc 已加载的文档代理
   */
  const loadOutline = async (doc: PDFDocumentProxy) => {
    outlineLoading.value = true
    try {
      const raw = (await doc.getOutline()) as RawOutlineItem[] | null
      if (!isCurrentDoc(doc)) return
      const build = async (items: RawOutlineItem[], level: number, prefix: string): Promise<OutlineNode[]> => {
        const nodes: OutlineNode[] = []
        for (let index = 0; index < items.length; index++) {
          const item = items[index]
          if (!isCurrentDoc(doc)) return nodes
          const id = `${prefix}-${index}`
          const target = await resolveDest(doc, item.dest ?? null)
          nodes.push({
            id,
            title: (item.title || '').trim() || '未命名书签',
            page: target?.page ?? null,
            offset: target?.offset ?? 0,
            level,
            open: true,
            children: item.items?.length ? await build(item.items, level + 1, id) : [],
          })
        }
        return nodes
      }
      outlineNodes.value = raw?.length ? await build(raw, 0, 'o') : []
    } catch (error) {
      console.error('PDF目录加载失败:', error)
      outlineNodes.value = []
    } finally {
      if (isCurrentDoc(doc)) outlineLoaded.value = true
      outlineLoading.value = false
    }
  }

  /**
   * 点击目录项跳转到对应页
   *
   * @param node 目录节点
   */
  const handleOutlineClick = async (node: OutlineNode) => {
    if (node.page) {
      // 优先按标题文本定位，让章节标题落在视口顶部；失败时回退书签坐标 / 页首
      const doc = getDoc()
      let offset = node.offset
      if (doc) {
        const found = await locateTitleOffset(doc, node.page, node.title)
        if (found >= 0) {
          offset = found
          node.offset = found
        }
      }
      scrollToPage(node.page, offset)
      return
    }
    // 无目标页的纯分组节点：点击即展开/收起
    if (node.children.length) toggleOutline(node)
  }

  const reset = () => {
    outlineNodes.value = []
    outlineLoaded.value = false
    outlineLoading.value = false
  }

  return {
    outlineNodes,
    outlineLoaded,
    outlineLoading,
    visibleOutline,
    toggleOutline,
    handleOutlineClick,
    loadOutline,
    reset,
  }
}
