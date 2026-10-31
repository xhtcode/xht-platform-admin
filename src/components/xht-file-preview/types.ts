import type { SysFilePreviewResponse } from '@/service/model/system/file.model'

/**
 * 文件预览模式
 */
export type XhtFilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 需要独立预览器渲染的模式
 *
 * 音视频由原生 `video` / `audio` 标签渲染，不需要单独的预览器组件。
 */
export type XhtFilePreviewRenderMode = 'image' | 'pdf' | 'text' | 'json'

/**
 * 文件预览信息
 *
 * 与具体业务响应结构解耦，业务行数据（如 SysFileResponse）结构兼容即可直接传入。
 */
export interface XhtFilePreviewFile {
  fileStorageKey: string // 文件存储key（预览/下载接口使用）
  fileOriginalName?: string // 文件原始名称
  fileType?: string // 文件类型（MIME）
  fileSuffix?: string // 文件后缀
}

/**
 * 文件预览属性
 */
export interface XhtFilePreviewProps {
  file?: XhtFilePreviewFile | null // 待预览的文件信息，为空时不渲染内容
}

/**
 * 文件预览组件状态
 */
export interface XhtFilePreviewState {
  loadingStatus: boolean // 加载状态
  previewMode: XhtFilePreviewMode // 预览模式
  previewUrl: string // 预览地址（blob 地址，PDF 为后端直连地址）
  previewHeaders: Record<string, string> // 直连预览地址所需的请求头（PDF 分段拉取时附带鉴权）
  fileInfo: SysFilePreviewResponse | null // 服务端返回的预览信息（完整文件名、大小、类型、地址）
}
