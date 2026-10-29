/**
 * PDF 预览属性
 */
export interface XhtPdfPreviewProps {
  url: string // PDF 文件地址（blob 地址或可访问的预览地址）
  fileName?: string // 文件名（用于工具栏展示及下载/打印命名）
  httpHeaders?: Record<string, string> // 直连预览地址时附带的请求头（如鉴权 Token），配合 HTTP Range 分段拉取
}

/**
 * 图片预览属性
 */
export interface XhtPicturePreviewProps {
  url: string // 图片地址（blob 地址或可访问的预览地址）
}

/**
 * 文本预览属性
 */
export interface XhtTxtPreviewProps {
  url: string // 文本地址（blob 地址，需为 text/plain 类型）
}

/**
 * JSON 预览属性
 */
export interface XhtJsonPreviewProps {
  url: string // JSON 文件地址（blob 地址或可访问的预览地址）
}
