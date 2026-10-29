import type { ComputedRef, Ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { XhtPdfPreviewProps } from '@/components/xht-file-preview/components/types'
import type { useMessage } from '@/hooks/use-message'
import type { ZOOM_PERCENTS } from './constants'

/**
 * 页面原始尺寸（scale=1）
 */
export interface PageSize {
  width: number
  height: number
}

/**
 * 缩放模式（对齐 pdf.js viewer）：
 * - auto：随布局联动，本组件为连续滚动布局，行为等同 page-width
 * - page-fit / page-width：固定规则，窗口尺寸变化时自动重算
 * - page-actual：scale=1 原始尺寸，完全不受 resize 影响
 * - custom：用户通过 ± 按钮或百分比档位手动指定，resize 不干预
 */
export type ZoomMode = 'auto' | 'page-fit' | 'page-width' | 'page-actual' | 'custom'
export type ZoomOption = 'auto' | 'page-fit' | 'page-width' | 'page-actual' | (typeof ZOOM_PERCENTS)[number]

/**
 * 组件内部响应式状态
 */
export interface PdfPreviewState {
  loadingStatus: boolean // 文档加载状态
  total: number // 总页数
  current: number // 当前页码（由滚动位置同步）
  scale: number // 缩放比例
  progress: number // 文档加载进度（0-100）
  rendering: boolean // 是否存在进行中的页面渲染
  printing: boolean // 打印内容生成状态
  zoomMode: ZoomMode // 缩放模式
  rotation: number // 用户旋转偏移（0/90/180/270），叠加在页面自身旋转之上
  handTool: boolean // 手形工具：按住拖拽平移内容区
  presenting: boolean // 演示模式：全屏 + 整页适配 + 键盘翻页
}

/**
 * 文档目录（大纲）节点
 */
export interface OutlineNode {
  id: string
  title: string
  page: number | null
  /** 页内纵向偏移（scale=1 时的 px），来自书签目标坐标 */
  offset: number
  level: number
  open: boolean
  children: OutlineNode[]
}

/**
 * pdf.js 原始大纲节点（仅声明用到的字段）
 */
export interface RawOutlineItem {
  title: string
  dest: string | unknown[] | null
  items?: RawOutlineItem[]
}

/**
 * 书签目标解析结果：页码 + 页内纵向偏移
 */
export interface DestTarget {
  page: number
  offset: number
}

/**
 * 附件条目
 */
export interface AttachmentItem {
  id: string
  filename: string // 展示用文件名
  description: string // 附件描述
  size: number // 字节数（未预载时为 0）
}

/**
 * 图层配置类型（pdf.js 未对外导出该类，按接口返回值推导）
 */
export type OptionalContentConfig = Awaited<ReturnType<PDFDocumentProxy['getOptionalContentConfig']>>

/**
 * 图层条目
 */
export interface LayerItem {
  id: string
  name: string
  visible: boolean
}

/**
 * 搜索命中矩形（CSS px，scale=1 口径）
 */
export interface SearchHitRect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * 一次搜索命中：所在页 + 首矩形纵向位置（滚动定位用）+ 高亮矩形集合
 */
export interface SearchMatch {
  page: number // 所在页（从 1 开始）
  top: number // 命中处首个矩形的纵向位置（用于滚动定位）
  rects: SearchHitRect[]
}

/**
 * 单页文本几何索引（搜索数据基础）
 */
export interface PageTextIndex {
  text: string // 拼接后的全文
  folded: string // 变音符号折叠后的全文（é→e），用于忽略变音符号的匹配
  foldMap: number[] // folded 各字符在 text 中的原始下标（命中区间映射回原文用）
  items: { str: string; left: number; top: number; width: number; height: number }[] // 文本项几何信息（CSS px 口径）
  starts: number[] // 各文本项在全文中的起始下标
}

/**
 * 文档属性行
 */
export interface PropertyRow {
  label: string
  value: string
  divider?: boolean
}

/**
 * 拆分出的各功能模块与主组件之间的共享上下文。
 * 主组件在装配各阶段通过 Object.assign 逐段补齐字段；
 * 模块内部只在事件回调/异步流程中调用方法字段，此时全部字段已就绪。
 */
export interface PdfCoreContext {
  props: XhtPdfPreviewProps
  state: PdfPreviewState
  message: ReturnType<typeof useMessage>
  /** 内容区容器（模板 ref，只读访问） */
  containerRef: { readonly value: HTMLDivElement | null }
  sidebarVisible: Ref<boolean>
  pageSizes: Ref<(PageSize | null)[]>
  pageHeights: ComputedRef<number[]>
  pageTops: ComputedRef<number[]>
  /** 当前文档代理；未加载/已销毁时为 null */
  getDoc: () => PDFDocumentProxy | null
  /** 文档代际校验：异步流程醒来后确认文档未切换 */
  isCurrentDoc: (doc: PDFDocumentProxy) => boolean
  rawPageSize: (no: number) => PageSize
  pageSizeAt: (no: number) => PageSize
  renderVisiblePages: () => void
  scrollToPage: (no: number, offset?: number) => void
  findPageAtTop: (scrollTop: number) => number
  refreshAfterScaleChange: (anchor: number) => Promise<void>
  clearRendered: () => void
  scaleForMode: (mode: ZoomMode) => number
  invalidateThumbs: () => void
  setupThumbObserver: () => void
  destroyThumbs: () => void
  triggerDownload: (href: string, name?: string) => void
  /** 渲染需携带的图层配置 Promise（无图层文档为 null） */
  getOcConfigPromise: () => Promise<OptionalContentConfig> | null
}
