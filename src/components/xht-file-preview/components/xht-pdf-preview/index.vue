<script lang="ts" setup>
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { XhtPdfPreviewProps } from '@/components/xht-file-preview/components/xht-pdf-preview/types'
import { createPdfRangeSource } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/pdf-range-transport'
import { attachTextLayerSelection, detachTextLayerSelection } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/pdf-text-selection'
import { useMessage } from '@/hooks/use-message'
import { createAttachmentsFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/attachments'
import PdfFindBar from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-find-bar.vue'
import PdfPages from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-pages.vue'
import PdfPrintOverlay from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-print-overlay.vue'
import PdfPropertiesDialog from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-properties-dialog.vue'
import PdfShortcutsDialog from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-shortcuts-dialog.vue'
import PdfSidebar from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-sidebar.vue'
import PdfStatus from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-status.vue'
import PdfToolbar from '@/components/xht-file-preview/components/xht-pdf-preview/components/pdf-toolbar.vue'
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
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_WIDTH,
} from '@/components/xht-file-preview/components/xht-pdf-preview/utils/constants'
import { createLayersFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/layers'
import { createOutlineFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/outline'
import { createPresentationFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/presentation'
import { createPrintFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/print'
import { createPropertiesFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/properties'
import { createSearchFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/search'
import { createThumbsFeature } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/thumbs'
import { handleDownloadSysFile } from '@/utils/file'
import type {
  OptionalContentConfig,
  PageSize,
  PdfCoreContext,
  PdfPreviewState,
  ZoomOption,
} from '@/components/xht-file-preview/components/xht-pdf-preview/utils/types'
import { triggerDownload } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/utils'

/**
 * PDF 预览：基于 pdf.js 连续滚动渲染，支持滚动翻页、页码跳转、缩放、下载与打印。
 * 功能按模块拆分（search/outline/attachments/layers/thumbs/properties/print/presentation），
 * 视图按区域拆分为子组件（toolbar/sidebar/pages/find-bar/shortcuts-dialog/properties-dialog/status），
 * 本文件只保留核心渲染管线、缩放定位与各模块的装配编排。
 *
 * 样式说明：样式按区块拆为 SCSS 分片，各子组件在自己 scoped 块内 @use 对应分片。
 * 分片内的选择器均为 `xht-pdf-preview__*` 绝对选择器（BEM 拼接不保留外层类名），
 * 因此可直接在子组件作用域内命中子组件自己的元素；跨组件命中的规则用 :deep 穿透。
 */
defineOptions({ name: 'XhtPdfPreview', inheritAttrs: true })

const props = withDefaults(defineProps<XhtPdfPreviewProps>(), { fileName: '' })

const message = useMessage()

// Worker 以独立资源引入，由 Vite 处理打包与 URL 解析
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const state = reactive<PdfPreviewState>({
  loadingStatus: true,
  total: 0,
  current: 1,
  scale: DEFAULT_SCALE,
  progress: 0,
  rendering: false,
  printing: false,
  printProgress: 0,
  zoomMode: 'auto',
  rotation: 0,
  handTool: false,
  presenting: false,
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')

/**
 * 子组件回填的模板 ref。
 * 注意：模板里直接引用 ref 变量会被自动解包成元素值，故包一层对象再传给子组件。
 */
const childRefs = {
  /** 缩略图列表容器（侧栏子组件回填） */
  thumbList: ref<HTMLDivElement | null>(null),
  /** 搜索输入框（搜索栏子组件回填） */
  searchInput: ref<HTMLInputElement | null>(null),
}

/**
 * 回填缩略图列表容器（侧栏子组件回调）
 *
 * @param el 容器元素
 */
const setThumbListEl = (el: HTMLDivElement | null) => {
  childRefs.thumbList.value = el
}

/**
 * 回填搜索输入框（搜索栏子组件回调）
 *
 * @param el 输入框元素
 */
const setSearchInputEl = (el: HTMLInputElement | null) => {
  childRefs.searchInput.value = el
}

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

let loadingTask: PDFDocumentLoadingTask | null = null
let pdfDoc: PDFDocumentProxy | null = null

const pageSizes = ref<(PageSize | null)[]>([])

const displayName = computed(() => props.fileName || '未命名文档')

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
 * 页面纸面尺寸样式
 *
 * @param no 页码（从 1 开始）
 */
const paperStyle = (no: number) => {
  const size = pageSizeAt(no)
  return { width: `${Math.floor(size.width * state.scale)}px`, height: `${Math.floor(size.height * state.scale)}px` }
}

/**
 * 页面位图是否已渲染完成（供页面列表展示加载占位）
 *
 * @param no 页码
 */
const isPageRendered = (no: number) => renderedPages.has(no)

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
    default: {
      // auto：竖页按宽适配，横页宽高取小，且最大只放大到 125%（MAX_AUTO_SCALE）
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
  // 渲染期间隐藏可见画布：canvas 重设尺寸会清空加速位图，未绘制的位图被 GPU 合成时
  // 显示为整页黑帧（快速滚动时多页同时进入该窗口尤为明显）。隐藏后由纸面白底占位，
  // 绘制完成后才取消隐藏，未绘制内容永远不被合成
  canvas.hidden = true
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
    // 绘制完成期间文档可能已被销毁
    if (pdfDoc !== doc) return
    // 内容已绘制到位，取消隐藏展示（与隐藏不隔 await，中间无合成帧）
    canvas.hidden = false
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
    // 渲染期间画布被卸载（位图清零或处于隐藏占位）：撤销"已渲染"标记，待下次可见时重新绘制
    if (canvas.width === 0 || canvas.hidden) {
      renderedPages.delete(no)
    }
  }
}

/**
 * 卸载当前缩放比例下已渲染的页面（缩放后需要全部重绘）
 *
 * 注意：卸载的画布需隐藏并清零位图，同时移除"已渲染"标记，否则 renderPage 会跳过它们；
 * 隐藏是为了避免清零后的加速位图被 GPU 合成显示为整页黑帧
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
    canvas.hidden = true
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
      // 隐藏后再清零位图：清零的加速位图被合成会显示为黑帧，隐藏后由纸面白底占位
      canvas.hidden = true
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
const ctxBase = {
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
} as Partial<PdfCoreContext>
// 分阶段装配：缩略图/图层相关字段需待对应功能模块创建后经 Object.assign 补齐，
// 故基础字段先以 Partial 收集，再整体断言一次为完整类型（避免 as unknown 双重断言）
const ctx = ctxBase as PdfCoreContext

const searchApi = createSearchFeature(ctx, childRefs.searchInput)
const outlineApi = createOutlineFeature(ctx)
const attachmentsApi = createAttachmentsFeature(ctx)
const layersApi = createLayersFeature(ctx)
// 渲染管线接入图层配置
getRenderOcConfig = layersApi.getOcConfigPromise
const thumbsApi = createThumbsFeature(ctx, childRefs.thumbList, sidebarTab)
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
  // 换文档时复位视图状态：旋转/手形均针对旧文档，不随新文档延续
  state.rotation = 0
  state.handTool = false
  // 演示模式复位统一走 presentation 模块的 exitPresentation（同步 zoom/scale 并重绘），
  // 全屏退出交由浏览器 fullscreenchange 回调同步，避免「state 已非演示但容器仍全屏」半状态
  if (state.presenting) {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    presentationApi.exitPresentation()
  }
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
      // cMap / 标准字体 / wasm 资源已复制到 public/pdfjs/（随仓库静态托管），避免依赖外网 CDN 导致内网环境渲染失败
      cMapUrl: `${import.meta.env.BASE_URL}pdfjs/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${import.meta.env.BASE_URL}pdfjs/standard_fonts/`,
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
 * 下载当前文档
 *
 * 走系统标准下载接口（业务异常按后端文案透传、按 xht-download-filename 响应头命名）
 */
const handleDownload = async () => {
  if (!props.fileStorageKey) {
    message.warning('缺少文件下载凭证，无法下载')
    return
  }
  try {
    // 失败提示（业务异常/请求错误）由 handleDownloadSysFile 与请求拦截器给出，此处只记录日志
    if (await handleDownloadSysFile(props.fileStorageKey)) {
      message.success('文件下载成功!')
    }
  } catch (error) {
    console.error('PDF下载失败:', error)
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
 *
 * trailing 必须为 true：滚动停止时的最后一次事件落在节流窗口内会被丢弃，
 * 导致当前页码/缩略图高亮停在旧页（useThrottleFn 默认 trailing=false）
 */
const handleScroll = useThrottleFn(
  () => {
    const container = containerRef.value
    if (!container || !pageTops.value.length) return
    renderVisiblePages()
    state.current = findPageAtTop(container.scrollTop)
  },
  80,
  true
)

watch(
  () => props.url,
  (url) => {
    if (url) {
      loadDocument()
    }
  },
  { immediate: true }
)

/**
 * 将缩略图列表滚动到当前页：当前页缩略图贴列表底部，视口内始终呈现「上一页 + 当前页」，
 * 页码每 +1 列表即精确跟进一张（只滚动列表自身，不波及外层滚动容器）
 */
const syncThumbScroll = () => {
  const list = childRefs.thumbList.value
  const wrapper = thumbsApi.thumbWrappers.get(state.current)
  if (!list || !wrapper || !sidebarVisible.value || sidebarTab.value !== 'thumb') return
  const listRect = list.getBoundingClientRect()
  const rect = wrapper.getBoundingClientRect()
  list.scrollTop += rect.bottom - listRect.bottom
}

watch(
  () => state.current,
  () => {
    // 侧栏展开时让当前页缩略图立即跟进（缩略图元素几何位置不随页码变化，无需等 DOM patch）
    syncThumbScroll()
  }
)

// 侧栏收起期间发生的滚动不会触发上面的同步（面板隐藏时无法定位），
// 展开侧栏或切回缩略图页后需主动补一次滚动，否则列表仍停在旧位置
watch([sidebarVisible, sidebarTab], () => nextTick(syncThumbScroll))

useResizeObserver(containerRef, () => handleResize())

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('fullscreenchange', presentationApi.handleFullscreenChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('fullscreenchange', presentationApi.handleFullscreenChange)
  printApi.closeWindow()
  destroyDocument()
})
</script>

<template>
  <div class="xht-pdf-preview">
    <!-- 文档加载中 / 加载失败 -->
    <PdfStatus
      v-if="state.loadingStatus || !state.total"
      :loading="state.loadingStatus"
      :progress="state.progress"
      :display-name="displayName"
      @reload="loadDocument"
      @download="handleDownload"
    />

    <template v-else>
      <!-- 单行工具栏（pdf.js 官方风格） -->
      <PdfToolbar
        :state="state"
        :display-name="displayName"
        :sidebar-visible="sidebarVisible"
        @toggle-sidebar="sidebarVisible = !sidebarVisible"
        @go-page="scrollToPage"
        @toggle-search="searchApi.toggleSearch()"
        @zoom="handleZoom"
        @select-zoom="selectZoom"
        @download="handleDownload"
        @print="printApi.handlePrint()"
        @rotate="handleRotate"
        @set-hand-tool="state.handTool = $event"
        @toggle-presentation="presentationApi.togglePresentation()"
        @open-properties="propertiesApi.loadProperties()"
        @open-shortcuts="shortcutsVisible = true"
      />

      <!-- 快捷键说明弹窗 -->
      <PdfShortcutsDialog v-model:visible="shortcutsVisible" />

      <!-- 文档属性弹窗 -->
      <PdfPropertiesDialog :properties="propertiesApi" />

      <!-- 搜索栏：浮于内容区左上，仿官方 viewer findbar -->
      <PdfFindBar v-if="searchApi.searchOpen.value" :search="searchApi" :set-input-ref="setSearchInputEl" />

      <div class="xht-pdf-preview__main">
        <!-- 侧栏：目录 / 缩略图 / 附件 / 图层 -->
        <PdfSidebar
          v-show="sidebarVisible"
          v-model:tab="sidebarTab"
          :style="{ width: `${sidebarWidth}px` }"
          :state="state"
          :outline="outlineApi"
          :thumbs="thumbsApi"
          :attachments="attachmentsApi"
          :layers="layersApi"
          :set-list-ref="setThumbListEl"
          @go-page="scrollToPage"
        />

        <!-- 侧栏宽度拖拽条 -->
        <div v-show="sidebarVisible" class="xht-pdf-preview__resize-bar" @mousedown.prevent="startResize" />

        <!-- 文件内容：全部页面按序排列，滚动即翻页 -->
        <div
          ref="containerRef"
          class="xht-pdf-preview__canvas"
          :class="{ 'is-hand': state.handTool }"
          @scroll.passive="handleScroll"
          @mousedown="handleContainerMousedown"
        >
          <PdfPages
            :state="state"
            :paper-style="paperStyle"
            :search="searchApi"
            :is-page-rendered="isPageRendered"
            :set-page-canvas="setPageCanvas"
            :set-page-text-layer="setPageTextLayer"
          />
        </div>

        <!-- 渲染进度条：页面位图渲染期间在内容区顶部展示 -->
        <transition name="el-fade-in">
          <div v-if="state.rendering" class="xht-pdf-preview__rendering-bar" />
        </transition>
      </div>
    </template>

    <!-- 打印等待遮罩：大文档逐页转图片期间展示进度并锁定交互 -->
    <PdfPrintOverlay :visible="state.printing" :progress="state.printProgress" :total="state.total" />
  </div>
</template>

<style lang="scss" scoped>
/* 样式按区块拆分：根容器 / 内容区 / 拖拽条在本组件，
   工具栏 / 侧栏 / 页面列表 / 搜索栏 / 弹窗 / 状态页由对应子组件各自 @use 同名分片 */
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/base.scss';
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/content.scss';
@use '@/components/xht-file-preview/components/xht-pdf-preview/styles/resize.scss';
</style>
