import { computed, nextTick, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjsLib from 'pdfjs-dist'
import { CONTENT_PADDING, PDF_TO_CSS_UNITS, SEARCH_SCROLL_MARGIN } from './constants'
import type { PageTextIndex, PdfCoreContext, SearchHitRect, SearchMatch } from './types'

/**
 * 变音符号折叠：NFD 分解后去除组合附加符号（é→e），用于忽略变音符号的匹配
 *
 * @param input 原始文本
 */
export const foldText = (input: string) => input.normalize('NFD').replace(/\p{M}/gu, '')

/**
 * 建立折叠文本到原始文本的下标映射（逐字符折叠，保留每个折叠字符的原文位置）
 *
 * @param text 原始全文
 */
export const buildFoldIndex = (text: string) => {
  const foldedChars: string[] = []
  const foldMap: number[] = []
  for (let i = 0; i < text.length; i++) {
    const folded = text[i].normalize('NFD').replace(/\p{M}/gu, '')
    if (folded) {
      foldedChars.push(folded)
      foldMap.push(i)
    }
  }
  return { folded: foldedChars.join(''), foldMap }
}

/**
 * 单字符的相对宽度权重（以 CJK 全角为 1）：用于命中区间在文本项内按比例定位。
 * 比例字体下数字/拉丁字母明显窄于汉字，按字符数均分会造成横向漂移。
 *
 * @param ch 字符
 */
const charWidthWeight = (ch: string): number => {
  const code = ch.codePointAt(0) ?? 0
  if (code >= 0x2e80) return 1 // CJK 及全角区
  if (code === 0x20) return 0.32
  if (code >= 0x21 && code <= 0x7e) {
    if ('iljI!,.:;\'"|'.includes(ch)) return 0.3
    if ('ft()[]{}/\\-'.includes(ch)) return 0.4
    if ('wmMW@'.includes(ch)) return 0.9
    if (ch >= 'A' && ch <= 'Z') return 0.68
    return 0.55
  }
  return 0.6
}

/**
 * 前 n 个字符的权重和占全项权重比（n 可越界，夹取后归一化）
 *
 * @param str 文本项内容
 * @param n 字符数
 */
const weightFraction = (str: string, n: number) => {
  const clamped = Math.max(0, Math.min(str.length, n))
  let part = 0
  let total = 0
  for (let i = 0; i < str.length; i++) {
    const weight = charWidthWeight(str[i])
    total += weight
    if (i < clamped) part += weight
  }
  return total > 0 ? part / total : clamped / str.length
}

/**
 * 由命中区间构造高亮矩形：按字符宽度加权在所属文本项内切分（比例字体下为近似位置）
 */
export const buildSearchMatch = (page: number, pageText: PageTextIndex, start: number, end: number): SearchMatch => {
  const rects: SearchHitRect[] = []
  let top = Number.POSITIVE_INFINITY
  for (let index = 0; index < pageText.items.length; index++) {
    const item = pageText.items[index]
    const itemStart = pageText.starts[index]
    const itemEnd = itemStart + item.str.length
    if (itemEnd <= start || itemStart >= end || !item.str.length) continue
    const from = weightFraction(item.str, start - itemStart)
    const to = weightFraction(item.str, end - itemStart)
    // 字形主体位于基线上方约 0.85em 至基线下方约 0.15em，整 em 全放在基线上会显得偏上
    const itemTop = item.top - item.height * 0.85
    rects.push({
      left: item.left + from * item.width,
      top: itemTop,
      width: Math.max(1, item.width * (to - from)),
      height: item.height,
    })
    if (itemTop < top) top = itemTop
  }
  return { page, top: Number.isFinite(top) ? top : 0, rects }
}

/**
 * 提取一页文本并建立几何索引
 *
 * @param doc        文档代理
 * @param isCurrent  文档代际校验（提取等待期间文档可能已切换）
 * @param no         页码（从 1 开始）
 */
export const extractPageText = async (doc: PDFDocumentProxy, isCurrent: (doc: PDFDocumentProxy) => boolean, no: number): Promise<PageTextIndex | null> => {
  try {
    const page = await doc.getPage(no)
    if (!isCurrent(doc)) return null
    const content = await page.getTextContent()
    if (!isCurrent(doc)) return null
    const viewport = page.getViewport({ scale: PDF_TO_CSS_UNITS })
    const items: PageTextIndex['items'] = []
    const starts: number[] = []
    let text = ''
    for (const raw of content.items) {
      if (!('str' in raw)) continue
      starts.push(text.length)
      text += raw.str
      // 项几何：视口变换后取基线位置与字高（CSS px 口径）；宽度按项宽 × 系数
      const tx = pdfjsLib.Util.transform(viewport.transform, raw.transform)
      items.push({
        str: raw.str,
        left: tx[4],
        top: tx[5],
        width: (raw.width || 0) * PDF_TO_CSS_UNITS,
        height: Math.hypot(tx[2], tx[3]) || Math.abs(raw.transform[3]) * PDF_TO_CSS_UNITS || 12,
      })
    }
    const { folded, foldMap } = buildFoldIndex(text)
    return { text, folded, foldMap, items, starts }
  } catch (error) {
    console.error('PDF文本提取失败:', error)
    return null
  }
}

/**
 * 搜索模块返回值
 */
export interface SearchFeature {
  searchOpen: Ref<boolean>
  searchInput: Ref<string>
  searchHighlightAll: Ref<boolean>
  searchCaseSensitive: Ref<boolean>
  searchWholeWord: Ref<boolean>
  searchDiacritics: Ref<boolean>
  searchMatches: Ref<SearchMatch[]>
  searchCurrentLabel: ComputedRef<number>
  searchExtracting: Ref<boolean>
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  handleSearchKeydown: (event: KeyboardEvent) => void
  handleSearchNext: () => void
  handleSearchPrev: () => void
  pageHitRects: (no: number) => Array<SearchHitRect & { matchNo: number }>
  hitLayerStyle: (no: number) => { left: string; top: string; width: string; height: string; transform?: string }
  hitStyle: (rect: SearchHitRect) => Record<string, string>
  /** 命中处映射为旋转后纸面的纵向偏移（缩放锚定/跳转定位复用） */
  rotatedMatchOffset: (match: SearchMatch) => number
  /** 文档销毁时使进行中的提取与结果失效（不关闭搜索栏） */
  resetForDocument: () => void
}

/**
 * 创建搜索功能模块（对齐官方 viewer 的 findbar）：
 * 逐页提取文本内容建立索引，按条件全文匹配，命中处在纸面上叠加高亮矩形；
 * 文本按页缓存，再次搜索不重复提取。
 *
 * @param ctx             核心上下文
 * @param searchInputRef  搜索输入框模板 ref（打开时聚焦）
 */
export const createSearchFeature = (ctx: PdfCoreContext, searchInputRef: { readonly value: HTMLInputElement | null }): SearchFeature => {
  const { state, pageTops, renderVisiblePages, getDoc, isCurrentDoc, rawPageSize, pageSizeAt } = ctx

  const searchOpen = ref(false)
  const searchInput = ref('')
  const searchHighlightAll = ref(true)
  const searchCaseSensitive = ref(false)
  const searchWholeWord = ref(false)
  const searchDiacritics = ref(false) // 是否匹配变音符号；默认忽略（对齐官方 findbar）
  const searchMatches = ref<SearchMatch[]>([])
  const searchCurrent = ref(0) // 1-based；0 表示尚未定位
  const searchExtracting = ref(false)
  const searchTextCache = new Map<number, PageTextIndex>()
  const lastSearchedQuery = ref('') // 最近一次已执行搜索的查询词（回车判断「重搜」还是「下一个」）
  let searchGeneration = 0 // 文档切换/关闭搜索后使进行中的提取与搜索失效

  /**
   * 滚动到搜索命中处：命中行上方预留空间，保证上下文可见
   *
   * @param match 命中项
   */
  const scrollToSearchMatch = (match: SearchMatch) => {
    const container = ctx.containerRef.value
    if (!container || !pageTops.value.length) return
    const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
    const target = CONTENT_PADDING + (pageTops.value[match.page - 1] ?? 0) + rotatedMatchOffset(match)
    container.scrollTop = Math.min(maxTop, Math.max(0, target - SEARCH_SCROLL_MARGIN))
    state.current = match.page
    renderVisiblePages()
  }

  /**
   * 把命中处（记录于未旋转坐标系）映射为旋转后纸面上的纵向偏移。
   * 旋转 180° 时纵向翻转；90°/270° 时屏幕纵向对应未旋转坐标的横向，取首个矩形的横向位置近似。
   *
   * @param match 命中项
   */
  function rotatedMatchOffset(match: SearchMatch): number {
    const rect = match.rects[0]
    if (!rect) return 0
    const raw = rawPageSize(match.page)
    switch (state.rotation) {
      case 90:
        return rect.left * state.scale
      case 180:
        return (raw.height - rect.top - rect.height) * state.scale
      case 270:
        return (raw.width - rect.left - rect.width) * state.scale
      default:
        return match.top * state.scale
    }
  }

  /**
   * 当前匹配在展示层的序号（实时更新中可能暂超总数，展示时夹取）
   */
  const searchCurrentLabel = computed(() => Math.min(searchCurrent.value, searchMatches.value.length))

  /**
   * 按页分组命中（供纸面叠加高亮）
   */
  const searchHitsByPage = computed(() => {
    const map = new Map<number, { matchNo: number; rects: SearchHitRect[] }[]>()
    searchMatches.value.forEach((match, index) => {
      const list = map.get(match.page) ?? []
      list.push({ matchNo: index + 1, rects: match.rects })
      map.set(match.page, list)
    })
    return map
  })

  /**
   * 某页的高亮矩形（摊平到矩形粒度，附所属匹配序号）
   */
  const pageHitRects = (no: number) => {
    return (searchHitsByPage.value.get(no) ?? []).flatMap((hit) => hit.rects.map((rect) => ({ matchNo: hit.matchNo, ...rect })))
  }

  /**
   * 高亮矩形容器样式：矩形坐标基于未旋转页面，旋转时把容器按未旋转尺寸居中放置后
   * 整体旋转，与画布的旋转绘制保持对位（画布即由未旋转内容绕纸面中心旋转而来）
   *
   * @param no 页码（从 1 开始）
   */
  const hitLayerStyle = (no: number) => {
    const raw = rawPageSize(no)
    const width = `${Math.floor(raw.width * state.scale)}px`
    const height = `${Math.floor(raw.height * state.scale)}px`
    if (state.rotation === 0) {
      return { left: '0px', top: '0px', width, height }
    }
    const size = pageSizeAt(no)
    return {
      left: `${Math.floor(((size.width - raw.width) * state.scale) / 2)}px`,
      top: `${Math.floor(((size.height - raw.height) * state.scale) / 2)}px`,
      width,
      height,
      transform: `rotate(${state.rotation}deg)`,
    }
  }

  /**
   * 单个高亮矩形的定位样式（scale=1 口径 × 当前缩放）
   */
  const hitStyle = (rect: SearchHitRect) => ({
    left: `${rect.left * state.scale}px`,
    top: `${rect.top * state.scale}px`,
    width: `${rect.width * state.scale}px`,
    height: `${rect.height * state.scale}px`,
  })

  /**
   * 组装搜索正则（转义字面量；全词匹配用 Unicode 字符类界定词边界；忽略变音符号时查询词先折叠）
   */
  const buildSearchRegex = () => {
    const query = searchInput.value
    if (!query) return null
    const literal = searchDiacritics.value ? query : foldText(query)
    let source = literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (searchWholeWord.value) source = `(?<![\\p{L}\\p{N}_])${source}(?![\\p{L}\\p{N}_])`
    return new RegExp(source, `${searchCaseSensitive.value ? '' : 'i'}gu`)
  }

  /**
   * 执行搜索：逐页取文本（缓存优先），边提取边更新结果与计数
   */
  const runSearch = async () => {
    const generation = ++searchGeneration
    const doc = getDoc()
    lastSearchedQuery.value = searchInput.value
    searchMatches.value = []
    searchCurrent.value = 0
    const regex = buildSearchRegex()
    if (!doc || !regex) {
      searchExtracting.value = false
      return
    }
    searchExtracting.value = true
    const found: SearchMatch[] = []
    for (let no = 1; no <= doc.numPages; no++) {
      if (searchGeneration !== generation || !isCurrentDoc(doc)) return
      let pageText: PageTextIndex | null = searchTextCache.get(no) ?? null
      if (!pageText) {
        pageText = await extractPageText(doc, isCurrentDoc, no)
        if (!pageText || searchGeneration !== generation || !isCurrentDoc(doc)) return
        searchTextCache.set(no, pageText)
      }
      regex.lastIndex = 0
      // 忽略变音符号时在折叠文本上匹配，命中区间再映射回原文下标以定位高亮
      const fold = !searchDiacritics.value
      const target = fold ? pageText.folded : pageText.text
      for (let m = regex.exec(target); m; m = regex.exec(target)) {
        if (!m[0].length) {
          regex.lastIndex++
          continue
        }
        const foldedEnd = m.index + m[0].length
        const start = fold ? pageText.foldMap[m.index] : m.index
        const end = fold ? (foldedEnd >= pageText.foldMap.length ? pageText.text.length : pageText.foldMap[foldedEnd]) : foldedEnd
        found.push(buildSearchMatch(no, pageText, start, end))
      }
      searchMatches.value = [...found]
      // 首个命中出现即定位过去，输入过程中就能看到结果
      if (searchCurrent.value === 0 && found.length) {
        searchCurrent.value = 1
        scrollToSearchMatch(found[0])
      }
    }
    if (searchGeneration === generation) searchExtracting.value = false
  }
  const debouncedSearch = useDebounceFn(runSearch, 250)
  watch([searchInput, searchCaseSensitive, searchWholeWord, searchDiacritics], debouncedSearch)

  /**
   * 跳转指定序号的命中（自动回绕），并锚定其纵向位置
   */
  const gotoSearchMatch = (no: number) => {
    const total = searchMatches.value.length
    if (!total) return
    const wrapped = ((((no - 1) % total) + total) % total) + 1
    searchCurrent.value = wrapped
    const match = searchMatches.value[wrapped - 1]
    scrollToSearchMatch(match)
  }
  const handleSearchNext = () => gotoSearchMatch(searchCurrentLabel.value + 1)
  const handleSearchPrev = () => gotoSearchMatch(searchCurrentLabel.value - 1)

  /**
   * 搜索框按键：Enter 搜索/下一个（查询变更时重搜并定位首个命中，未变时逐个跳转）/ Shift+Enter 上一个 / Esc 关闭
   */
  const handleSearchKeydown = (event: KeyboardEvent) => {
    // 中文输入法组词阶段的 Enter 是确认候选词，不当作搜索指令
    if (event.isComposing || event.keyCode === 229) return
    if (event.key === 'Escape') {
      closeSearch()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (event.shiftKey) {
        handleSearchPrev()
        return
      }
      // 查询词未变：回车跳到下一个命中；变更了：立即执行搜索（跳过输入防抖）定位首个命中
      if (searchInput.value === lastSearchedQuery.value && searchMatches.value.length) {
        gotoSearchMatch(searchCurrentLabel.value + 1)
      } else {
        runSearch()
      }
    }
  }

  /**
   * 打开/关闭搜索栏；关闭即清除结果与高亮
   */
  const openSearch = () => {
    searchOpen.value = true
    nextTick(() => searchInputRef.value?.focus())
  }
  const closeSearch = () => {
    searchOpen.value = false
    resetForDocument()
  }
  const toggleSearch = () => (searchOpen.value ? closeSearch() : openSearch())

  /**
   * 文档销毁/切换：结果与文本索引随文档一起失效，进行中的提取通过代际号中断
   */
  function resetForDocument() {
    searchGeneration++
    searchExtracting.value = false
    searchMatches.value = []
    searchCurrent.value = 0
    searchTextCache.clear()
  }

  return {
    searchOpen,
    searchInput,
    searchHighlightAll,
    searchCaseSensitive,
    searchWholeWord,
    searchDiacritics,
    searchMatches,
    searchCurrentLabel,
    searchExtracting,
    openSearch,
    closeSearch,
    toggleSearch,
    handleSearchKeydown,
    handleSearchNext,
    handleSearchPrev,
    pageHitRects,
    hitLayerStyle,
    hitStyle,
    rotatedMatchOffset,
    resetForDocument,
  }
}
