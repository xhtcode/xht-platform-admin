import type { CSSProperties } from 'vue'
import type { AttachmentsFeature } from '../attachments'
import type { LayersFeature } from '../layers'
import type { OutlineFeature } from '../outline'
import type { PropertiesFeature } from '../properties'
import type { SearchFeature } from '../search'
import type { ThumbsFeature, SidebarTab } from '../thumbs'
import type { PdfPreviewState, ZoomOption } from '../types'

/**
 * 工具栏属性：展示状态 + 交互结果全部经事件回传主组件处理
 */
export interface PdfToolbarProps {
  state: PdfPreviewState
  displayName: string
  sidebarVisible: boolean
}

/**
 * 工具栏 emit
 */
export interface PdfToolbarEmits {
  (e: 'toggleSidebar'): void
  (e: 'goPage', no: number): void
  (e: 'toggleSearch'): void
  (e: 'zoom', delta: number): void
  (e: 'selectZoom', option: ZoomOption): void
  (e: 'download'): void
  (e: 'print'): void
  (e: 'rotate', delta: number): void
  (e: 'setHandTool', value: boolean): void
  (e: 'togglePresentation'): void
  (e: 'openProperties'): void
  (e: 'openShortcuts'): void
}

/**
 * 侧栏属性：四个面板的数据与操作由对应功能模块提供
 */
export interface PdfSidebarProps {
  state: PdfPreviewState
  outline: OutlineFeature
  thumbs: ThumbsFeature
  attachments: AttachmentsFeature
  layers: LayersFeature
  /** 回填缩略图列表容器（缩略图懒渲染观察器由主组件持有） */
  setListRef: (el: HTMLDivElement | null) => void
}

/**
 * 侧栏 emit
 */
export interface PdfSidebarEmits {
  (e: 'update:tab', tab: SidebarTab): void
  (e: 'goPage', no: number): void
}

/**
 * 页面列表属性：逐页纸面 + 画布 + 文本层 + 搜索高亮
 */
export interface PdfPagesProps {
  state: PdfPreviewState
  /** 单页纸面尺寸样式（按缩放/旋转计算） */
  paperStyle: (no: number) => CSSProperties
  search: SearchFeature
  /** 收集画布 ref（渲染管线由主组件持有） */
  setPageCanvas: (no: number, el: unknown) => void
  /** 收集文本层容器 ref */
  setPageTextLayer: (no: number, el: unknown) => void
}

/**
 * 搜索栏属性
 */
export interface PdfFindBarProps {
  search: SearchFeature
  /** 回填搜索输入框（打开搜索时聚焦由搜索模块调用） */
  setInputRef: (el: HTMLInputElement | null) => void
}

/**
 * 文档属性弹窗属性：字段文本由文档属性模块生成
 */
export interface PdfPropertiesDialogProps {
  properties: PropertiesFeature
}

/**
 * 状态页属性：加载中 / 加载失败
 */
export interface PdfStatusProps {
  loading: boolean
  progress: number
  displayName: string
}

/**
 * 状态页 emit
 */
export interface PdfStatusEmits {
  (e: 'reload'): void
  (e: 'download'): void
}
