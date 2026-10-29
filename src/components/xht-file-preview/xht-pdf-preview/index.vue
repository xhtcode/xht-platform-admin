<script lang="ts" setup>
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { XhtPdfPreviewProps } from '@/components/xht-file-preview/components/types'
import { createPdfRangeSource } from '@/components/xht-file-preview/pdf-range-transport'
import { attachTextLayerSelection, detachTextLayerSelection } from '@/components/xht-file-preview/pdf-text-selection'
import { useMessage } from '@/hooks/use-message'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Close, DArrowLeft, DArrowRight, Download, Grid, InfoFilled, Loading, Minus, MoreFilled, Paperclip, Plus, Printer, QuestionFilled, Refresh, RefreshLeft, RefreshRight, Search, WarningFilled } from '@element-plus/icons-vue'
import { createAttachmentsFeature } from './attachments'
import {
  CONTENT_PADDING,
  DEFAULT_SCALE,
  KEEP_PAGES,
  MAX_AUTO_SCALE,
  MAX_PIXEL_RATIO,
  MAX_SCALE,
  MIN_SCALE,
  PAGE_GAP,
  PDF_RANGE_CHUNK_SIZE,
  PDF_TO_CSS_UNITS,
  SEARCH_SCROLL_MARGIN,
  SHORTCUT_ITEMS,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_WIDTH,
  ZOOM_PERCENTS,
} from './constants'
import { createLayersFeature } from './layers'
import { createOutlineFeature } from './outline'
import { createPresentationFeature } from './presentation'
import { createPrintFeature } from './print'
import { createPropertiesFeature } from './properties'
import { createSearchFeature } from './search'
import { createThumbsFeature } from './thumbs'
import type { OptionalContentConfig, PageSize, PdfCoreContext, PdfPreviewState, ZoomOption } from './types'
import { formatBytes, triggerDownload } from './utils'

/**
 * PDF 预览：基于 pdf.js 连续滚动渲染，支持滚动翻页、页码跳转、缩放、下载与打印。
 * 功能按模块拆分（search/outline/attachments/layers/thumbs/properties/print/presentation），
 * 本文件只保留核心渲染管线、缩放定位与各模块的装配编排。
 */
defineOptions({ name: 'XhtPdfPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtPdfPreviewProps>(), { fileName: '' })

const message = useMessage()

// Worker 以独立资源引入，由 Vite 处理打包与 URL 解析
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

/**
 * pdf.js 版本号，用于拼接 CDN 的 cMap / 标准字体资源地址（中日韩等非拉丁文档渲染需要）
 */
const PDFJS_VERSION = pdfjsLib.version

const state = reactive<PdfPreviewState>({
  loadingStatus: true,
  total: 0,
  current: 1,
  scale: DEFAULT_SCALE,
  progress: 0,
  rendering: false,
  printing: false,
  zoomMode: 'auto',
  rotation: 0,
  handTool: false,
  presenting: false,
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const thumbListRef = useTemplateRef<HTMLDivElement>('thumbListRef')

/**
 * 缩略图侧栏显示状态：宽屏默认展开，窄屏收起
 */
const sidebarVisible = ref(window.innerWidth >= 1024)

/**
 * 侧栏标签页：目录（文档大纲） / 缩略图 / 附件 / 图层（可选内容组）
 */
const sidebarTab = ref<'thumb' | 'outline' | 'attach' | 'layer'>('outline')

/**
 * 侧栏宽度（px），可通过分隔条拖拽调整
 */
const sidebarWidth = ref(SIDEBAR_WIDTH)

/**
 * 缩放模式下拉菜单展开状态
 */
const zoomMenuVisible = ref(false)

/**
 * 更多功能菜单（首末页/旋转/手形工具/演示模式/文档属性）
 */
const moreMenuVisible = ref(false)

// 两个菜单的触发器容器 ref：用于判断 mousedown 是否发生在菜单区域内
const zoomWrapRef = ref<HTMLElement>()
const moreWrapRef = ref<HTMLElement>()

/**
 * 菜单外 mousedown 即关闭。用 mousedown 而非遮罩层 + click：
 * 1) 在页面上拖拽选字不产生 click，遮罩层方案收不到关闭时机；
 * 2) 不用遮罩层拦截事件，mousedown 仍能到达页面元素，拖拽选择不受影响。
 *
 * @param event 全局 mousedown 事件
 */
const handleGlobalMousedown = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof Node)) return
  if (zoomMenuVisible.value && !zoomWrapRef.value?.contains(target)) {
    zoomMenuVisible.value = false
  }
  if (moreMenuVisible.value && !moreWrapRef.value?.contains(target)) {
    moreMenuVisible.value = false
  }
}

/**
 * 快捷键说明弹窗
 */
const shortcutsVisible = ref(false)

// 各页画布引用：v-for 内通过函数 ref 收集
const canvasMap = new Map<number, HTMLCanvasElement>()
// 各页文本层容器与任务（文本选择工具）：pdf.js TextLayer 在画布上叠放透明可选中文本
const textLayerDivs = new Map<number, HTMLDivElement>()
const textLayerTasks = new Map<number, InstanceType<typeof pdfjsLib.TextLayer>>()
const renderedTextPages = new Set<number>()
const renderTasks = new Map<number, RenderTask>()
// 已渲染完成的页码集合
const renderedPages = reactive(new Set<number>())
let renderingCount = 0

// 页码输入框：与 state.current 双向同步，输入非法值时回填当前页
const pageInput = ref('1')

let loadingTask: PDFDocumentLoadingTask | null = null
let pdfDoc: PDFDocumentProxy | null = null

const pageSizes = ref<(PageSize | null)[]>([])

const displayName = computed(() => props.fileName || '未命名文档')

const downloadName = computed(() => (/\.pdf$/i.test(props.fileName) ? props.fileName : `${props.fileName || 'document'}.pdf`))

const scalePercent = computed(() => `${Math.round(state.scale * 100)}%`)

/**
 * 页面未旋转时的原始尺寸（CSS px 口径）；用户旋转不改变该坐标系
 *
 * @param no 页码（从 1 开始）
 */
const rawPageSize = (no: number): PageSize => {
  const size = pageSizes.value[no - 1]
  const known = size ?? pageSizes.value.find((item) => item) ?? { width: 595, height: 842 }
  // 统一换算为 CSS px（对齐官方 viewer 的 PDF_TO_CSS_UNITS），布局与适配计算均基于该口径
  return { width: known.width * PDF_TO_CSS_UNITS, height: known.height * PDF_TO_CSS_UNITS }
}

const pageSizeAt = (no: number): PageSize => {
  const { width, height } = rawPageSize(no)
  // 旋转 90/270 时宽高互换，布局与缩放适配随旋转联动
  return state.rotation % 180 === 0 ? { width, height } : { width: height, height: width }
}

/**
 * 各页缩放后的渲染高度（px），与样式中的纸面尺寸一致
 */
const pageHeights = computed(() => pageSizes.value.map((_, index) => Math.floor(pageSizeAt(index + 1).height * state.scale)))

/**
 * 各页在内容区中的起始偏移（不含容器内边距）
 */
const pageTops = computed(() => {
  const tops: number[] = []
  let offset = 0
  pageHeights.value.forEach((height) => {
    tops.push(offset)
    offset += height + PAGE_GAP
  })
  return tops
})

/**
 * 缩放下拉按钮文案（对齐 pdf.js：自动缩放 / 适合页面 / 适合页宽 / 实际大小 / 百分比）
 */
const zoomLabel = computed(() => {
  if (state.zoomMode === 'auto') return '自动缩放'
  if (state.zoomMode === 'page-fit') return '适合页面'
  if (state.zoomMode === 'page-width') return '适合页宽'
  if (state.zoomMode === 'page-actual') return '实际大小'
  return scalePercent.value
})

/**
 * 缩放菜单项是否为当前选项：按模式精确匹配，不从 scale 反推（避免多项同时打勾）
 *
 * @param option 菜单项
 */
const isZoomCurrent = (option: ZoomOption) => {
  if (option === 'auto' || option === 'page-fit' || option === 'page-width' || option === 'page-actual') {
    return state.zoomMode === option
  }
  // 百分比档位：仅手动指定（custom）且比例吻合时勾选
  return state.zoomMode === 'custom' && Math.round(state.scale * 100) === option
}

/**
 * 页面纸面尺寸样式
 *
 * @param no 页码（从 1 开始）
 */
const paperStyle = (no: number) => {
  const size = pageSizeAt(no)
  return { width: `${Math.floor(size.width * state.scale)}px`, height: `${Math.floor(size.height * state.scale)}px` }
}

/**
 * 收集 v-for 内的画布引用
 *
 * @param no 页码
 * @param el ref 元素
 */
const setPageCanvas = (no: number, el: unknown) => {
  if (el instanceof HTMLCanvasElement) {
    canvasMap.set(no, el)
  } else {
    canvasMap.delete(no)
  }
}

// ==================== 文本层（文本选择工具） ====================

/**
 * 收集 v-for 内的文本层容器引用
 *
 * @param no 页码
 * @param el ref 元素
 */
const setPageTextLayer = (no: number, el: unknown) => {
  if (el instanceof HTMLDivElement) {
    textLayerDivs.set(no, el)
  } else {
    textLayerDivs.delete(no)
    renderedTextPages.delete(no)
  }
}

/**
 * 释放单页文本层：取消进行中的渲染并清空已挂载的透明文本
 *
 * @param no 页码
 */
const destroyTextLayer = (no: number) => {
  const task = textLayerTasks.get(no)
  if (task) {
    try {
      task.cancel()
    } catch {
      // 渲染已结束，忽略
    }
    textLayerTasks.delete(no)
  }
  renderedTextPages.delete(no)
  const layerDiv = textLayerDivs.get(no)
  if (layerDiv) detachTextLayerSelection(layerDiv)
  layerDiv?.replaceChildren()
}

/**
 * 释放全部文本层（缩放/旋转/销毁文档后需按新视口重建）
 */
const destroyTextLayers = () => {
  for (const no of new Set([...textLayerTasks.keys(), ...renderedTextPages])) {
    destroyTextLayer(no)
  }
}

/**
 * 渲染单页文本层：与画布共用同一视口口径（缩放 + 页面自身旋转 + 用户旋转），
 * 保证透明文本与绘制内容逐字对位，从而支持选中与复制
 *
 * @param no 页码
 */
const renderTextLayer = async (no: number) => {
  const doc = pdfDoc
  const div = textLayerDivs.get(no)
  if (!doc || !div || renderedTextPages.has(no)) return
  renderedTextPages.add(no)
  const page = await doc.getPage(no)
  // 等待期间文档可能已被销毁或该页文本层已被清除
  if (pdfDoc !== doc || !renderedTextPages.has(no) || textLayerDivs.get(no) !== div) return
  const viewport = page.getViewport({ scale: state.scale * PDF_TO_CSS_UNITS, rotation: (page.rotate + state.rotation) % 360 })
  const layer = new pdfjsLib.TextLayer({
    // 官方 viewer 同参：带标记内容便于定位，规范化交给 TextLayer 内部处理
    textContentSource: page.streamTextContent({ includeMarkedContent: true, disableNormalization: true }),
    container: div,
    viewport,
  })
  textLayerTasks.set(no, layer)
  try {
    await layer.render()
    // 挂接官方 endOfContent 选择边界修正，避免空白处拖拽多选
    attachTextLayerSelection(div)
  } catch {
    // 渲染被取消（缩放/旋转/销毁）属正常流程，静默忽略
  } finally {
    if (textLayerTasks.get(no) === layer) {
      textLayerTasks.delete(no)
    }
  }
}

// ==================== 核心渲染管线 ====================

/**
 * 按缩放模式计算比例（对齐 pdf.js viewer 的 _setScale：以当前页为准，而非全文档最宽/最高页）
 *
 * @param mode 缩放模式
 */
const scaleForMode = (mode: PdfPreviewState['zoomMode']): number => {
  const container = containerRef.value
  if (!container || !pageSizes.value.length) return DEFAULT_SCALE
  const style = window.getComputedStyle(container)
  const availableWidth = container.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)
  const availableHeight = container.clientHeight - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)
  const size = pageSizeAt(state.current)
  if (availableWidth <= 0 || availableHeight <= 0 || !size.width || !size.height) return DEFAULT_SCALE
  const widthScale = availableWidth / size.width
  const heightScale = availableHeight / size.height
  const clamp = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(scale * 100) / 100))
  switch (mode) {
    case 'page-width':
      // 适合页宽：宽度撑满，无上限约束
      return clamp(widthScale)
    case 'page-fit':
      // 适合页面：宽高一起约束，整页容纳在视口内
      return clamp(Math.min(widthScale, heightScale))
    case 'page-actual':
      // 实际大小：scale=1 原始尺寸
      return DEFAULT_SCALE
    default:
      // auto：竖页按宽适配，横页宽高取小，且最大只放大到 125%（MAX_AUTO_SCALE）
      {
        const horizontal = size.width <= size.height ? widthScale : Math.min(widthScale, heightScale)
        return clamp(Math.min(MAX_AUTO_SCALE, horizontal))
      }
  }
}

// 渲染需携带的图层配置读取器（图层模块装配后接入）
let getRenderOcConfig: (() => Promise<OptionalContentConfig> | null) | null = null

/**
 * 渲染单页
 *
 * @param no 页码
 */
const renderPage = async (no: number) => {
  const doc = pdfDoc
  const canvas = canvasMap.get(no)
  if (!doc || !canvas || renderedPages.has(no)) return
  try {
    renderTasks.get(no)?.cancel()
  } catch {
    // 上一次渲染已结束或已取消，忽略
  }
  const page = await doc.getPage(no)
  // 等待期间文档可能已被销毁
  if (pdfDoc !== doc || renderedPages.has(no)) return
  // 渲染位图按官方口径放大到 CSS px（scale 只是查看器档位，实际绘制倍数 = scale × PDF_TO_CSS_UNITS）
  // rotation 为页面自身旋转与用户旋转之和
  const viewport = page.getViewport({ scale: state.scale * PDF_TO_CSS_UNITS, rotation: (page.rotate + state.rotation) % 360 })
  // 位图总放大倍数（scale × PDF_TO_CSS_UNITS × devicePixelRatio）封顶，兼顾清晰度与内存
  const ratio = Math.min(window.devicePixelRatio || 1, Math.max(1, MAX_PIXEL_RATIO / (state.scale * PDF_TO_CSS_UNITS)))
  canvas.width = Math.max(1, Math.floor(viewport.width * ratio))
  canvas.height = Math.max(1, Math.floor(viewport.height * ratio))
  const task = page.render({
    canvas,
    viewport,
    // 携带图层配置：手动切换的图层可见性才能作用到绘制结果
    optionalContentConfigPromise: getRenderOcConfig?.() ?? undefined,
    transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
  })
  renderTasks.set(no, task)
  renderedPages.add(no)
  // 画布渲染的同时叠放透明文本层（文本选择工具的数据基础）
  renderTextLayer(no)
  renderingCount++
  state.rendering = true
  try {
    await task.promise
  } catch {
    // 渲染被取消（切页/缩放/销毁）属正常流程，静默忽略
  } finally {
    // 任务条目可能已被更新的渲染任务覆盖，只清理属于自己的条目
    if (renderTasks.get(no) === task) {
      renderTasks.delete(no)
    }
    renderingCount--
    if (renderingCount <= 0) {
      renderingCount = 0
      state.rendering = false
    }
    // 渲染期间画布被清空（如缩放重绘）：撤销"已渲染"标记，待下次可见时重新绘制
    if (canvas.width === 0) {
      renderedPages.delete(no)
    }
  }
}

/**
 * 卸载当前缩放比例下已渲染的页面（缩放后需要全部重绘）
 *
 * 注意：位图清零的页面必须同时移除"已渲染"标记，否则 renderPage 会跳过它们，
 * 留下永不重绘的空白画布（GPU 合成下显示为整页黑屏）。
 */
const clearRendered = () => {
  for (const task of renderTasks.values()) {
    try {
      task.cancel()
    } catch {
      // 渲染已结束，忽略
    }
  }
  renderTasks.clear()
  renderedPages.clear()
  // 文本层与画布共用视口口径，位图清零后需一并重建
  destroyTextLayers()
  for (const canvas of canvasMap.values()) {
    canvas.width = 0
    canvas.height = 0
  }
}

/**
 * 卸载远离可视区的页面，控制长文档内存占用
 *
 * @param firstVisible 可视区首个页码
 * @param lastVisible 可视区末个页码
 */
const unrenderFarPages = (firstVisible: number, lastVisible: number) => {
  for (const no of renderedPages) {
    if (no >= firstVisible - KEEP_PAGES && no <= lastVisible + KEEP_PAGES) continue
    try {
      renderTasks.get(no)?.cancel()
    } catch {
      // 渲染已结束，忽略
    }
    renderTasks.delete(no)
    renderedPages.delete(no)
    const canvas = canvasMap.get(no)
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
    }
    // 远离可视区的页面连同文本层一起释放，控制长文档内存占用
    destroyTextLayer(no)
  }
}

/**
 * 渲染可视区（含上下缓冲）内的页面，并卸载远离可视区的页面
 */
const renderVisiblePages = () => {
  const container = containerRef.value
  if (!container || !pageHeights.value.length) return
  const viewTop = container.scrollTop
  const viewBottom = viewTop + container.clientHeight
  let firstVisible = pageHeights.value.length
  let lastVisible = 1
  for (let no = 1; no <= pageHeights.value.length; no++) {
    const top = CONTENT_PADDING + pageTops.value[no - 1]
    const bottom = top + pageHeights.value[no - 1]
    if (bottom < viewTop - 300 || top > viewBottom + 300) continue
    firstVisible = Math.min(firstVisible, no)
    lastVisible = Math.max(lastVisible, no)
    renderPage(no)
  }
  if (firstVisible <= lastVisible) {
    unrenderFarPages(firstVisible, lastVisible)
  }
}

/**
 * 滚动定位到指定页（可带页内纵向偏移，用于目录精准跳转）
 *
 * @param no 页码
 * @param offset 页内偏移（scale=1 时的 px）
 */
const scrollToPage = (no: number, offset = 0) => {
  const container = containerRef.value
  if (!container || !pageTops.value.length) return
  const clamped = Math.min(state.total, Math.max(1, no))
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
  container.scrollTop = Math.min(maxTop, CONTENT_PADDING + pageTops.value[clamped - 1] + offset * state.scale)
  state.current = clamped
  renderVisiblePages()
}

/**
 * 计算滚动位置顶部的当前页码
 *
 * @param scrollTop 滚动偏移
 */
const findPageAtTop = (scrollTop: number) => {
  let current = 1
  for (let no = 1; no <= pageTops.value.length; no++) {
    if (CONTENT_PADDING + pageTops.value[no - 1] <= scrollTop + 1) {
      current = no
    } else {
      break
    }
  }
  return current
}

// ==================== 功能模块装配 ====================

/**
 * 核心上下文：主组件向各功能模块暴露的共享能力。
 * 缩放刷新/缩略图/图层配置等字段随模块装配经 Object.assign 逐步补齐
 * （装配完成前不会有任何模块调用它们，均为事件回调/异步流程中的运行时调用）。
 */
const ctx:PdfCoreContext = {
  props,
  state,
  message,
  containerRef,
  sidebarVisible,
  pageSizes,
  pageHeights,
  pageTops,
  getDoc: () => pdfDoc,
  isCurrentDoc: (doc: PDFDocumentProxy) => pdfDoc === doc,
  rawPageSize,
  pageSizeAt,
  renderVisiblePages,
  scrollToPage,
  findPageAtTop,
  clearRendered,
  scaleForMode,
  triggerDownload,
  refreshAfterScaleChange,
} as unknown as PdfCoreContext

const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const searchApi = createSearchFeature(ctx, searchInputRef)
const outlineApi = createOutlineFeature(ctx)
const attachmentsApi = createAttachmentsFeature(ctx)
const layersApi = createLayersFeature(ctx)
// 渲染管线接入图层配置
getRenderOcConfig = layersApi.getOcConfigPromise
const thumbsApi = createThumbsFeature(ctx, thumbListRef, sidebarTab)
Object.assign(ctx, {
  refreshAfterScaleChange,
  invalidateThumbs: thumbsApi.invalidateThumbs,
  setupThumbObserver: thumbsApi.setupThumbObserver,
  destroyThumbs: thumbsApi.destroyThumbs,
  getOcConfigPromise: layersApi.getOcConfigPromise,
})
const propertiesApi = createPropertiesFeature(ctx, () => displayName.value)
const printApi = createPrintFeature(ctx, () => displayName.value)
const presentationApi = createPresentationFeature(ctx, searchApi.closeSearch)

/**
 * 缩放后刷新：清空已渲染页、锚定当前页位置并重绘可视区
 *
 * @param anchor 锚定页码
 */
function refreshAfterScaleChange(anchor: number) {
  clearRendered()
  return nextTick().then(async () => {
    const container = containerRef.value
    const match = searchApi.searchMatches.value[searchApi.searchCurrentLabel.value - 1]
    if (container) {
      // 存在当前搜索命中时锚定到命中处（预留顶部空间），缩放后保持上下文可见
      if (match) {
        const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
        const target = CONTENT_PADDING + (pageTops.value[match.page - 1] ?? 0) + searchApi.rotatedMatchOffset(match)
        container.scrollTop = Math.min(maxTop, Math.max(0, target - SEARCH_SCROLL_MARGIN))
      } else {
        container.scrollTop = CONTENT_PADDING + (pageTops.value[anchor - 1] ?? 0)
      }
    }
    state.current = match?.page ?? anchor
    renderVisiblePages()
  })
}

// ==================== 文档加载与销毁 ====================

/**
 * 释放当前文档（销毁 loadingTask 会同时结束其上的所有渲染任务）
 */
const destroyDocument = async () => {
  for (const task of renderTasks.values()) {
    try {
      task.cancel()
    } catch {
      // 渲染已结束，忽略
    }
  }
  renderTasks.clear()
  renderedPages.clear()
  canvasMap.clear()
  destroyTextLayers()
  renderingCount = 0
  state.rendering = false
  pageSizes.value = []
  thumbsApi.destroyThumbs()
  outlineApi.reset()
  attachmentsApi.attachments.value = []
  attachmentsApi.attachmentsLoading.value = false
  layersApi.layers.value = []
  layersApi.layersLoading.value = false
  layersApi.resetOcConfig()
  propertiesApi.pdfFileSize.value = 0
  propertiesApi.pdfLinearized.value = false
  searchApi.resetForDocument()
  // 侧栏回到目录，避免下次预览停在空面板上
  sidebarTab.value = 'outline'
  pdfDoc = null
  try {
    await loadingTask?.destroy()
  } catch (error) {
    console.error('PDF文档销毁失败:', error)
  }
  loadingTask = null
}

/**
 * 后台渐进补齐各页原始尺寸：用于纸面占位、滚动定位与页码同步
 *
 * @param doc 已加载的文档代理
 */
const loadPageSizesInBackground = async (doc: PDFDocumentProxy) => {
  for (let no = 2; no <= doc.numPages; no++) {
    // 文档已切换或销毁时停止补齐
    if (pdfDoc !== doc) return
    try {
      const page = await doc.getPage(no)
      if (pdfDoc !== doc) return
      const viewport = page.getViewport({ scale: 1 })
      pageSizes.value[no - 1] = { width: viewport.width, height: viewport.height }
    } catch (error) {
      console.error('PDF页面尺寸获取失败:', error)
    }
  }
}

/**
 * 加载 PDF 文档
 */
const loadDocument = async () => {
  state.loadingStatus = true
  state.progress = 0
  state.total = 0
  state.current = 1
  state.zoomMode = 'auto'
  try {
    await destroyDocument()
    // 接管取流：首块带 Range 探测（服务端支持时返回 206 并给出总长度），此后按 pdf.js 需要的区间逐段拉取。
    // pdf.js 自带的 url 取流首个请求必然不带 Range，会先整包下载一遍，故不使用。
    const source = await createPdfRangeSource(props.url, props.httpHeaders ?? {}, PDF_RANGE_CHUNK_SIZE, (loaded, total) => {
      if (total > 0) state.progress = Math.min(99, Math.round((loaded / total) * 100))
    })
    // 记录文件大小与线性化特征（文档属性弹窗展示用）
    propertiesApi.pdfFileSize.value = source.range ? source.range.length : (source.data?.byteLength ?? 0)
    propertiesApi.pdfLinearized.value = !!source.head && new TextDecoder('latin1').decode(source.head.subarray(0, 1024)).includes('/Linearized')
    const params: Parameters<typeof pdfjsLib.getDocument>[0] = {
      rangeChunkSize: PDF_RANGE_CHUNK_SIZE,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
      // v6 起 CCITT/JBIG2（扫描件常用）与 JPEG2000 解码依赖 wasm，未提供时解码失败整页会被画成黑色
      wasmUrl: `${import.meta.env.BASE_URL}pdfjs/wasm/`,
    }
    if (source.range) {
      params.range = source.range
    } else if (source.data) {
      params.data = source.data
    }
    const task = pdfjsLib.getDocument(params)
    loadingTask = task
    // 整包解析（服务端不支持分段）时由 pdf.js 上报真实进度
    task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
      if (total > 0) state.progress = Math.min(99, Math.round((loaded / total) * 100))
    }
    const doc = await task.promise
    pdfDoc = doc
    state.progress = 100
    state.total = doc.numPages
    // 仅预取首页尺寸即可进入可读状态；其余页尺寸由后台任务渐进补齐，避免大文档阻塞首屏
    const firstPage = await doc.getPage(1)
    const firstViewport = firstPage.getViewport({ scale: 1 })
    pageSizes.value = Array.from({ length: doc.numPages }, () => null)
    pageSizes.value[0] = { width: firstViewport.width, height: firstViewport.height }
    if (state.zoomMode === 'auto' || state.zoomMode === 'page-width') {
      state.scale = scaleForMode(state.zoomMode)
    }
    state.current = 1
    // 先退出加载态再渲染：内容区（含 canvas）由 total > 0 才会挂载，否则首屏拿不到画布
    state.loadingStatus = false
    await nextTick()
    renderVisiblePages()
    thumbsApi.setupThumbObserver()
    outlineApi.loadOutline(doc)
    attachmentsApi.loadAttachments(doc)
    layersApi.loadLayers(doc)
    loadPageSizesInBackground(doc)
  } catch (error) {
    // 文档加载失败（如 blob 已释放、格式损坏）：不弹全局提示，由父级降级展示
    console.error('PDF文档加载失败:', error)
    pdfDoc = null
    state.loadingStatus = false
  }
}

// ==================== 工具栏交互 ====================

/**
 * 开始拖拽调整侧栏宽度：跟随鼠标横移更新宽度，松开后结束
 *
 * @param event 鼠标按下事件
 */
const startResize = (event: MouseEvent) => {
  const startX = event.clientX
  const startWidth = sidebarWidth.value
  const maxWidth = Math.min(SIDEBAR_MAX_WIDTH, window.innerWidth - 240)
  let moved = false
  const onMove = (moveEvent: MouseEvent) => {
    moved = true
    sidebarWidth.value = Math.min(maxWidth, Math.max(SIDEBAR_MIN_WIDTH, startWidth + (moveEvent.clientX - startX)))
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    // 拖拽会改变缩略图显示宽度：松手后按新宽度重绘可见缩略图（拖拽过程仅 CSS 拉伸）
    if (moved && sidebarVisible.value) {
      thumbsApi.invalidateThumbs()
      thumbsApi.setupThumbObserver()
    }
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  // 拖拽期间锁定光标形态并禁止选中文本
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

/**
 * 翻页
 *
 * @param offset 页码偏移量
 */
const handlePageChange = (offset: number) => {
  scrollToPage(state.current + offset)
}

/**
 * 跳转到输入页码
 */
const handleJump = () => {
  const target = Number.parseInt(pageInput.value, 10)
  if (!Number.isFinite(target)) {
    pageInput.value = String(state.current)
    return
  }
  scrollToPage(target)
}

/**
 * 旋转页面：宽高互换后适配模式需重算，渲染位图全部重绘
 *
 * @param delta 旋转增量（90 或 -90）
 */
const handleRotate = async (delta: number) => {
  state.rotation = (state.rotation + delta + 360) % 360
  clearRendered()
  // 适配类模式跟随新尺寸重算；实际大小与自定义比例保持不变
  if (state.zoomMode !== 'page-actual' && state.zoomMode !== 'custom') {
    state.scale = scaleForMode(state.zoomMode)
  }
  await nextTick()
  ctx.refreshAfterScaleChange(state.current)
}

/**
 * 手形工具：按住左键拖拽平移内容区
 *
 * @param event 鼠标按下事件
 */
const handleContainerMousedown = (event: MouseEvent) => {
  const container = containerRef.value
  if (!state.handTool || event.button !== 0 || !container) return
  event.preventDefault()
  const startX = event.clientX
  const startY = event.clientY
  const { scrollLeft, scrollTop } = container
  const onMove = (moveEvent: MouseEvent) => {
    container.scrollLeft = scrollLeft - (moveEvent.clientX - startX)
    container.scrollTop = scrollTop - (moveEvent.clientY - startY)
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  document.body.style.cursor = 'grabbing'
  document.body.style.userSelect = 'none'
}

/**
 * 缩放
 *
 * @param delta 缩放步长
 */
const handleZoom = async (delta: number) => {
  const target = Math.round((state.scale + delta) * 100) / 100
  if (target < MIN_SCALE || target > MAX_SCALE) return
  const container = containerRef.value
  const anchor = container ? findPageAtTop(container.scrollTop) : state.current
  state.zoomMode = 'custom'
  state.scale = target
  await ctx.refreshAfterScaleChange(anchor)
}

/**
 * 切换缩放模式
 *
 * @param mode 目标模式（auto=自动缩放，page-width=适合页宽，page-fit=适合页面，page-actual=实际大小）
 */
const handleZoomMode = async (mode: 'auto' | 'page-fit' | 'page-width' | 'page-actual') => {
  const container = containerRef.value
  const anchor = container ? findPageAtTop(container.scrollTop) : state.current
  state.zoomMode = mode
  state.scale = scaleForMode(mode)
  await ctx.refreshAfterScaleChange(anchor)
}

/**
 * 应用缩放菜单选择
 *
 * @param option 菜单项（模式或百分比）
 */
const selectZoom = async (option: ZoomOption) => {
  zoomMenuVisible.value = false
  if (option === 'auto' || option === 'page-fit' || option === 'page-width' || option === 'page-actual') {
    await handleZoomMode(option)
    return
  }
  const container = containerRef.value
  const anchor = container ? findPageAtTop(container.scrollTop) : state.current
  state.zoomMode = 'custom'
  state.scale = option / 100
  await ctx.refreshAfterScaleChange(anchor)
}

/**
 * 应用精确缩放比例（对齐 pdf.js 的百分比档位）
 *
 * @param percent 目标百分比
 */
const handleZoomPercent = (percent: number) => selectZoom(percent)

/**
 * 下载当前文档
 *
 * blob 地址可直接触发下载；后端直连地址受鉴权保护，需带请求头取回文件后再保存
 */
const handleDownload = async () => {
  if (!props.url) return
  if (props.url.startsWith('blob:')) {
    triggerDownload(props.url, downloadName.value)
    return
  }
  try {
    const response = await fetch(props.url, { headers: props.httpHeaders, credentials: 'include' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const href = window.URL.createObjectURL(await response.blob())
    triggerDownload(href, downloadName.value)
    // 下载触发后即可回收，留出浏览器读取的时间
    setTimeout(() => window.URL.revokeObjectURL(href), 10_000)
  } catch (error) {
    console.error('PDF下载失败:', error)
    message.error('文件下载失败，请稍后重试')
  }
}

/**
 * 容器尺寸变化时按当前模式重算（对齐 pdf.js：auto/page-fit/page-width 自动重算，actual/custom 不动；
 * 宽度未变化时不重绘，避免加载阶段被误清空画布）
 */
const handleResize = useDebounceFn(() => {
  if (!pdfDoc) return
  if (state.zoomMode === 'page-actual' || state.zoomMode === 'custom') return
  const target = scaleForMode(state.zoomMode)
  if (Math.abs(target - state.scale) < 0.01) return
  const container = containerRef.value
  const anchor = container ? findPageAtTop(container.scrollTop) : state.current
  state.scale = target
  ctx.refreshAfterScaleChange(anchor)
}, 150)

// ==================== 全局事件与生命周期 ====================

/**
 * 全局快捷键：演示模式下方向键/空格翻页；Ctrl/Cmd+F 打开搜索（覆盖浏览器默认查找）
 */
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (state.presenting) {
    const forwardKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' ']
    const backKeys = ['ArrowLeft', 'ArrowUp', 'PageUp']
    if (forwardKeys.includes(event.key)) {
      event.preventDefault()
      scrollToPage(state.current + 1)
      return
    }
    if (backKeys.includes(event.key)) {
      event.preventDefault()
      scrollToPage(state.current - 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      scrollToPage(1)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      scrollToPage(state.total)
      return
    }
  }
  if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'f') {
    event.preventDefault()
    searchApi.openSearch()
  }
}

/**
 * 滚动同步：渲染新进入可视区的页面并更新当前页码
 */
const handleScroll = useThrottleFn(() => {
  const container = containerRef.value
  if (!container || !pageTops.value.length) return
  renderVisiblePages()
  state.current = findPageAtTop(container.scrollTop)
}, 80)

watch(
  () => props.url,
  (url) => {
    if (url) {
      loadDocument()
    }
  },
  { immediate: true }
)

watch(
  () => state.current,
  (current) => {
    pageInput.value = String(current)
    outlineApi.checkPinRelease(current)
    // 侧栏展开时让当前页缩略图保持可见
    if (sidebarVisible.value) {
      thumbsApi.thumbWrappers.get(current)?.scrollIntoView({ block: 'nearest' })
    }
  }
)

useResizeObserver(containerRef, () => handleResize())

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('fullscreenchange', presentationApi.handleFullscreenChange)
  document.addEventListener('mousedown', handleGlobalMousedown, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('fullscreenchange', presentationApi.handleFullscreenChange)
  document.removeEventListener('mousedown', handleGlobalMousedown, true)
  printApi.closeWindow()
  destroyDocument()
})
</script>

<template>
  <div class="xht-pdf-preview">
    <!-- 文档加载中 -->
    <div v-if="state.loadingStatus" class="xht-pdf-preview__status">
      <el-icon class="xht-pdf-preview__spin" :size="22"><Loading /></el-icon>
      <p class="xht-pdf-preview__status-title text-overflow">{{ displayName }}</p>
      <el-progress
        v-if="state.progress > 0"
        class="xht-pdf-preview__status-bar"
        :percentage="state.progress"
        :stroke-width="4"
        :show-text="false"
        color="#0b57d0"
      />
      <p class="xht-pdf-preview__status-desc">正在解析文档，请稍候…</p>
    </div>

    <!-- 文档加载失败 -->
    <div v-else-if="!state.total" class="xht-pdf-preview__status">
      <div class="xht-pdf-preview__status-card">
        <el-icon :size="26" color="#faad14"><WarningFilled /></el-icon>
        <p class="xht-pdf-preview__status-title">文档加载失败</p>
        <p class="xht-pdf-preview__status-desc">文件可能已损坏或已被释放，可重新加载或下载后查看</p>
        <div class="xht-pdf-preview__status-actions">
          <button type="button" class="xht-pdf-preview__action" @click="loadDocument">
            <el-icon :size="14"><RefreshLeft /></el-icon>
            重新加载
          </button>
          <button type="button" class="xht-pdf-preview__action is-primary" @click="handleDownload">
            <el-icon :size="14"><Download /></el-icon>
            下载文件
          </button>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- 单行工具栏（pdf.js 官方风格） -->
      <header class="xht-pdf-preview__toolbar">
        <div class="xht-pdf-preview__cluster">
          <el-tooltip content="页面缩略图" placement="bottom">
            <button
              type="button"
              class="xht-pdf-preview__btn"
              :class="{ 'is-active': sidebarVisible }"
              aria-label="切换缩略图侧栏"
              @click="sidebarVisible = !sidebarVisible"
            >
              <el-icon :size="15"><Grid /></el-icon>
            </button>
          </el-tooltip>

          <span class="xht-pdf-preview__divider" />

          <button type="button" class="xht-pdf-preview__btn" aria-label="上一页" :disabled="state.current <= 1" @click="handlePageChange(-1)">
            <el-icon :size="14"><ArrowLeft /></el-icon>
          </button>
          <div class="xht-pdf-preview__page-box">
            <input v-model="pageInput" class="xht-pdf-preview__page-input" inputmode="numeric" @change="handleJump" @keyup.enter="handleJump" />
            <span class="xht-pdf-preview__page-total">/ {{ state.total }}</span>
          </div>
          <button
            type="button"
            class="xht-pdf-preview__btn"
            aria-label="下一页"
            :disabled="state.current >= state.total"
            @click="handlePageChange(1)"
          >
            <el-icon :size="14"><ArrowRight /></el-icon>
          </button>

          <el-tooltip content="搜索（Ctrl+F）" placement="bottom">
            <button
              type="button"
              class="xht-pdf-preview__btn"
              :class="{ 'is-active': searchApi.searchOpen.value }"
              aria-label="搜索"
              @click="searchApi.toggleSearch()"
            >
              <el-icon :size="15"><Search /></el-icon>
            </button>
          </el-tooltip>

          <span class="xht-pdf-preview__divider" />

          <button type="button" class="xht-pdf-preview__btn" aria-label="缩小" :disabled="state.scale <= MIN_SCALE" @click="handleZoom(-0.1)">
            <el-icon :size="14"><Minus /></el-icon>
          </button>

          <div ref="zoomWrapRef" class="xht-pdf-preview__zoom">
            <button
              type="button"
              class="xht-pdf-preview__zoom-trigger"
              :class="{ 'is-open': zoomMenuVisible }"
              aria-label="选择缩放比例"
              @click="zoomMenuVisible = !zoomMenuVisible"
            >
              {{ zoomLabel }}
              <el-icon :size="11"><ArrowDown /></el-icon>
            </button>
            <div v-if="zoomMenuVisible" class="xht-pdf-preview__zoom-menu" role="menu">
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="selectZoom('auto')">
                <span class="xht-pdf-preview__zoom-check">
                  <el-icon v-if="isZoomCurrent('auto')" :size="12"><Check /></el-icon>
                </span>
                自动缩放
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="selectZoom('page-actual')">
                <span class="xht-pdf-preview__zoom-check">
                  <el-icon v-if="isZoomCurrent('page-actual')" :size="12"><Check /></el-icon>
                </span>
                实际大小
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="selectZoom('page-fit')">
                <span class="xht-pdf-preview__zoom-check">
                  <el-icon v-if="isZoomCurrent('page-fit')" :size="12"><Check /></el-icon>
                </span>
                适合页面
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="selectZoom('page-width')">
                <span class="xht-pdf-preview__zoom-check">
                  <el-icon v-if="isZoomCurrent('page-width')" :size="12"><Check /></el-icon>
                </span>
                适合页宽
              </button>
              <div class="xht-pdf-preview__zoom-sep" />
              <button
                v-for="percent in ZOOM_PERCENTS"
                :key="percent"
                type="button"
                class="xht-pdf-preview__zoom-item"
                role="menuitem"
                @click="handleZoomPercent(percent)"
              >
                <span class="xht-pdf-preview__zoom-check">
                  <el-icon v-if="isZoomCurrent(percent)" :size="12"><Check /></el-icon>
                </span>
                {{ percent }}%
              </button>
            </div>
          </div>

          <button type="button" class="xht-pdf-preview__btn" aria-label="放大" :disabled="state.scale >= MAX_SCALE" @click="handleZoom(0.1)">
            <el-icon :size="14"><Plus /></el-icon>
          </button>
        </div>

        <!-- 文件名：合并自原页面顶部信息栏，单行工具栏居中展示 -->
        <div v-if="displayName" class="xht-pdf-preview__filename" :title="displayName">
          {{ displayName }}
        </div>

        <div class="xht-pdf-preview__cluster is-right">
          <el-tooltip content="快捷键" placement="bottom">
            <button type="button" class="xht-pdf-preview__btn" aria-label="查看快捷键" @click="shortcutsVisible = true">
              <el-icon :size="15"><QuestionFilled /></el-icon>
            </button>
          </el-tooltip>
          <el-tooltip content="下载" placement="bottom">
            <button type="button" class="xht-pdf-preview__btn" aria-label="下载文件" @click="handleDownload">
              <el-icon :size="15"><Download /></el-icon>
            </button>
          </el-tooltip>
          <el-tooltip content="打印" placement="bottom">
            <button type="button" class="xht-pdf-preview__btn" aria-label="打印" :disabled="state.printing" @click="printApi.handlePrint()">
              <el-icon :size="15" :class="state.printing ? 'xht-pdf-preview__spin' : ''">
                <Loading v-if="state.printing" />
                <Printer v-else />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 更多功能：首末页 / 旋转 / 手形工具 / 演示模式 / 文档属性 -->
          <div ref="moreWrapRef" class="xht-pdf-preview__more">
            <el-tooltip content="更多功能" placement="bottom">
              <button
                type="button"
                class="xht-pdf-preview__btn"
                :class="{ 'is-active': moreMenuVisible }"
                aria-label="更多功能"
                @click="moreMenuVisible = !moreMenuVisible"
              >
                <el-icon :size="15"><MoreFilled /></el-icon>
              </button>
            </el-tooltip>
            <div v-if="moreMenuVisible" class="xht-pdf-preview__zoom-menu is-right" role="menu">
              <button
                type="button"
                class="xht-pdf-preview__zoom-item"
                :class="{ 'is-on': !state.handTool }"
                role="menuitem"
                @click="state.handTool = false"
              >
                <span class="xht-pdf-preview__zoom-check"><el-icon v-if="!state.handTool" :size="12"><Check /></el-icon></span>
                文本选择工具
              </button>
              <button
                type="button"
                class="xht-pdf-preview__zoom-item"
                :class="{ 'is-on': state.handTool }"
                role="menuitem"
                @click="state.handTool = true"
              >
                <span class="xht-pdf-preview__zoom-check"><el-icon v-if="state.handTool" :size="12"><Check /></el-icon></span>
                手形工具
              </button>
              <div class="xht-pdf-preview__zoom-sep" />
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" :disabled="state.current <= 1" @click="scrollToPage(1)">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><DArrowLeft /></el-icon></span>
                转到第一页
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" :disabled="state.current >= state.total" @click="scrollToPage(state.total)">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><DArrowRight /></el-icon></span>
                转到最后一页
              </button>
              <div class="xht-pdf-preview__zoom-sep" />
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleRotate(-90)">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><RefreshLeft /></el-icon></span>
                逆时针旋转
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" :disabled="state.rotation === 0" @click="handleRotate(-state.rotation)">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><Refresh /></el-icon></span>
                重置旋转
              </button>
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="handleRotate(90)">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><RefreshRight /></el-icon></span>
                顺时针旋转
              </button>
              <div class="xht-pdf-preview__zoom-sep" />
              <button type="button" class="xht-pdf-preview__zoom-item" :class="{ 'is-on': state.presenting }" role="menuitem" @click="presentationApi.togglePresentation()">
                <span class="xht-pdf-preview__zoom-check"><el-icon v-if="state.presenting" :size="12"><Check /></el-icon></span>
                演示模式
              </button>
              <div class="xht-pdf-preview__zoom-sep" />
              <button type="button" class="xht-pdf-preview__zoom-item" role="menuitem" @click="propertiesApi.loadProperties()">
                <span class="xht-pdf-preview__zoom-check"><el-icon :size="12"><InfoFilled /></el-icon></span>
                文档属性…
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 快捷键说明弹窗 -->
      <el-dialog v-model="shortcutsVisible" title="快捷键" width="560px" append-to-body>
        <ul class="xht-pdf-preview__shortcut-list">
          <li v-for="item in SHORTCUT_ITEMS" :key="item.label">
            <span class="xht-pdf-preview__shortcut-label">{{ item.label }}</span>
            <span class="xht-pdf-preview__shortcut-keys">
              <kbd v-for="key in item.keys" :key="key">{{ key }}</kbd>
            </span>
          </li>
        </ul>
      </el-dialog>

      <!-- 文档属性弹窗 -->
      <el-dialog v-model="propertiesApi.propertiesVisible.value" title="文档属性" width="640px" append-to-body>
        <ul class="xht-pdf-preview__property-list">
          <li v-for="(row, index) in propertiesApi.docProperties.value" :key="index" :class="{ 'is-divider': row.divider }">
            <span class="xht-pdf-preview__property-label">{{ row.label }}</span>
            <span class="xht-pdf-preview__property-value">{{ row.value }}</span>
          </li>
        </ul>
      </el-dialog>

      <!-- 搜索栏：浮于内容区左上，仿官方 viewer findbar -->
      <div v-if="searchApi.searchOpen.value" class="xht-pdf-preview__findbar">
        <input
          ref="searchInputRef"
          v-model="searchApi.searchInput.value"
          type="text"
          class="xht-pdf-preview__find-input"
          placeholder="在文档中搜索"
          @keydown="searchApi.handleSearchKeydown"
        />
        <button type="button" class="xht-pdf-preview__find-btn is-nav" aria-label="上一个" title="上一个" :disabled="!searchApi.searchMatches.value.length" @click="searchApi.handleSearchPrev()">
          <el-icon :size="13"><ArrowUp /></el-icon>
        </button>
        <button type="button" class="xht-pdf-preview__find-btn is-nav" aria-label="下一个" title="下一个" :disabled="!searchApi.searchMatches.value.length" @click="searchApi.handleSearchNext()">
          <el-icon :size="13"><ArrowDown /></el-icon>
        </button>
        <label class="xht-pdf-preview__find-option">
          <input v-model="searchApi.searchHighlightAll.value" type="checkbox" />
          <span>全部高亮显示</span>
        </label>
        <label class="xht-pdf-preview__find-option">
          <input v-model="searchApi.searchCaseSensitive.value" type="checkbox" />
          <span>区分大小写</span>
        </label>
        <label class="xht-pdf-preview__find-option">
          <input v-model="searchApi.searchWholeWord.value" type="checkbox" />
          <span>全词匹配</span>
        </label>
        <label class="xht-pdf-preview__find-option">
          <input v-model="searchApi.searchDiacritics.value" type="checkbox" />
          <span>匹配变音符号</span>
        </label>
        <span class="xht-pdf-preview__find-count">
          <template v-if="searchApi.searchExtracting.value">搜索中…</template>
          <template v-else-if="searchApi.searchMatches.value.length">{{ searchApi.searchCurrentLabel.value }}/{{ searchApi.searchMatches.value.length }}</template>
          <template v-else>无匹配结果</template>
        </span>
        <button type="button" class="xht-pdf-preview__find-btn" aria-label="关闭搜索" @click="searchApi.closeSearch()">
          <el-icon :size="13"><Close /></el-icon>
        </button>
      </div>

      <div class="xht-pdf-preview__main">
        <!-- 侧栏：目录 / 缩略图 / 附件 / 图层 -->
        <aside v-show="sidebarVisible" class="xht-pdf-preview__sidebar" :style="{ width: `${sidebarWidth}px` }">
          <div class="xht-pdf-preview__tabs" role="tablist">
            <button
              type="button"
              class="xht-pdf-preview__tab"
              :class="{ 'is-active': sidebarTab === 'outline' }"
              role="tab"
              @click="sidebarTab = 'outline'"
            >
              目录
            </button>
            <button
              type="button"
              class="xht-pdf-preview__tab"
              :class="{ 'is-active': sidebarTab === 'thumb' }"
              role="tab"
              @click="sidebarTab = 'thumb'"
            >
              缩略图
            </button>
            <!-- 附件、图层始终显示；文档没有对应内容时置灰禁用 -->
            <button
              type="button"
              class="xht-pdf-preview__tab"
              :class="{ 'is-active': sidebarTab === 'attach' }"
              role="tab"
              :disabled="!attachmentsApi.attachmentsLoading.value && !attachmentsApi.attachments.value.length"
              title="此文档没有附件"
              @click="sidebarTab = 'attach'"
            >
              附件
            </button>
            <button
              type="button"
              class="xht-pdf-preview__tab"
              :class="{ 'is-active': sidebarTab === 'layer' }"
              role="tab"
              :disabled="!layersApi.layersLoading.value && !layersApi.layers.value.length"
              title="此文档没有图层"
              @click="sidebarTab = 'layer'"
            >
              图层
            </button>
          </div>

          <div v-show="sidebarTab === 'outline'" class="xht-pdf-preview__outline">
            <p v-if="outlineApi.outlineLoading.value" class="xht-pdf-preview__outline-tip">正在读取目录…</p>
            <p v-else-if="outlineApi.outlineLoaded.value && !outlineApi.visibleOutline.value.length" class="xht-pdf-preview__outline-tip">此文档没有目录</p>
            <button
              v-for="node in outlineApi.visibleOutline.value"
              :key="node.id"
              type="button"
              class="xht-pdf-preview__outline-item"
              :class="{ 'is-current': node.id === outlineApi.outlineActiveId.value }"
              :style="{ paddingLeft: `${8 + node.level * 12}px` }"
              :title="node.title"
              @click="outlineApi.handleOutlineClick(node)"
            >
              <span
                class="xht-pdf-preview__outline-toggle"
                :class="{ 'is-open': node.open, 'is-empty': !node.children.length }"
                @click.stop="node.children.length && outlineApi.toggleOutline(node)"
              >
                <el-icon v-if="node.children.length" :size="10"><ArrowRight /></el-icon>
              </span>
              <span class="xht-pdf-preview__outline-title">{{ node.title }}</span>
            </button>
          </div>

          <div v-show="sidebarTab === 'thumb'" ref="thumbListRef" class="xht-pdf-preview__thumb-list">
            <button
              v-for="no in state.total"
              :key="no"
              type="button"
              class="xht-pdf-preview__thumb"
              :class="{ 'is-active': no === state.current }"
              :data-page="no"
              :ref="(el: any) => thumbsApi.setThumbWrapper(no, el)"
              @click="scrollToPage(no)"
            >
              <span class="xht-pdf-preview__thumb-paper"><canvas /></span>
              <span class="xht-pdf-preview__thumb-no">{{ no }}</span>
            </button>
          </div>

          <div v-show="sidebarTab === 'attach'" class="xht-pdf-preview__attach">
            <p v-if="attachmentsApi.attachmentsLoading.value" class="xht-pdf-preview__outline-tip">正在读取附件…</p>
            <p v-else-if="!attachmentsApi.attachments.value.length" class="xht-pdf-preview__outline-tip">此文档没有附件</p>
            <button
              v-for="item in attachmentsApi.attachments.value"
              :key="item.id"
              type="button"
              class="xht-pdf-preview__attach-item"
              :title="item.description || item.filename"
              @click="attachmentsApi.handleAttachmentClick(item)"
            >
              <el-icon :size="14" class="xht-pdf-preview__attach-icon"><Paperclip /></el-icon>
              <span class="xht-pdf-preview__attach-name text-overflow">{{ item.filename }}</span>
              <span v-if="item.size" class="xht-pdf-preview__attach-size">{{ formatBytes(item.size) }}</span>
            </button>
          </div>

          <div v-show="sidebarTab === 'layer'" class="xht-pdf-preview__layer">
            <p v-if="layersApi.layersLoading.value" class="xht-pdf-preview__outline-tip">正在读取图层…</p>
            <p v-else-if="!layersApi.layers.value.length" class="xht-pdf-preview__outline-tip">此文档没有图层</p>
            <button
              v-for="item in layersApi.layers.value"
              :key="item.id"
              type="button"
              class="xht-pdf-preview__layer-item"
              :title="item.name"
              @click="layersApi.toggleLayer(item)"
            >
              <span class="xht-pdf-preview__layer-box" :class="{ 'is-checked': item.visible }">
                <el-icon v-if="item.visible" :size="10"><Check /></el-icon>
              </span>
              <span class="xht-pdf-preview__layer-name text-overflow">{{ item.name }}</span>
            </button>
          </div>
        </aside>

        <!-- 侧栏宽度拖拽条 -->
        <div v-show="sidebarVisible" class="xht-pdf-preview__resize-bar" @mousedown.prevent="startResize" />

        <!-- 文件内容：全部页面按序排列，滚动即翻页 -->
        <div ref="containerRef" class="xht-pdf-preview__canvas" :class="{ 'is-hand': state.handTool }" @scroll.passive="handleScroll" @mousedown="handleContainerMousedown">
          <div v-for="no in state.total" :key="no" class="xht-pdf-preview__paper" :style="paperStyle(no)">
            <canvas :ref="(el: any) => setPageCanvas(no, el)" />
            <!-- 文本层：透明文本叠放于画布上，提供文本选择与复制能力 -->
            <div
              :ref="(el: any) => setPageTextLayer(no, el)"
              class="xht-pdf-preview__text-layer"
              :style="{ '--total-scale-factor': state.scale * PDF_TO_CSS_UNITS }"
            />
            <!-- 搜索高亮：叠加在文本层之上（不拦截选择事件）；坐标基于未旋转页面，旋转时容器整体旋转对位 -->
            <div v-if="searchApi.searchOpen.value" class="xht-pdf-preview__hit-layer" :style="searchApi.hitLayerStyle(no)">
              <span
                v-for="(rect, rectIndex) in searchApi.pageHitRects(no)"
                v-show="searchApi.searchHighlightAll.value || rect.matchNo === searchApi.searchCurrentLabel.value"
                :key="`${rect.matchNo}-${rectIndex}`"
                class="xht-pdf-preview__search-hit"
                :class="{ 'is-current': rect.matchNo === searchApi.searchCurrentLabel.value }"
                :style="searchApi.hitStyle(rect)"
              />
            </div>
          </div>
          <transition name="el-fade-in">
            <div v-if="state.rendering" class="xht-pdf-preview__rendering">
              <el-icon class="xht-pdf-preview__spin" :size="13"><Loading /></el-icon>
              <span>渲染中</span>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
/* 样式按区块拆分为 SCSS 分片：工具栏 / 侧栏 / 内容区 / 搜索栏 / 弹窗 / 状态页 */
@use './styles/toolbar.scss';
@use './styles/sidebar.scss';
@use './styles/content.scss';
@use './styles/findbar.scss';
@use './styles/dialogs.scss';
@use './styles/status.scss';
</style>
