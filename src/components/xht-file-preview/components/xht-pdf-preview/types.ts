/**
 * PDF 预览属性（组件对外契约；内部状态与模块上下文见 `utils/types.ts`）
 */
export interface XhtPdfPreviewProps {
  url: string // PDF 文件地址（blob 地址或可访问的预览地址）
  fileName?: string // 文件名（用于工具栏展示及下载/打印命名）
  fileStorageKey?: string // 文件存储key（存在时下载走系统标准下载接口）
  httpHeaders?: Record<string, string> // 直连预览地址时附带的请求头（如鉴权 Token），配合 HTTP Range 分段拉取
}
