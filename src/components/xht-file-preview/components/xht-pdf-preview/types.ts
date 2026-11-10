/**
 * PDF 预览属性（组件对外契约；内部状态与模块上下文见 `utils/types.ts`）
 */
export interface XhtPdfPreviewProps {
  url: string // PDF 内容地址（服务端下发的预览地址，已含 previewId）
  previewId: string // 预览ID（下载凭证）
  fileName?: string // 文件名（用于工具栏展示及下载/打印命名）
  downloadable?: boolean // 是否允许下载（默认允许）
  printable?: boolean // 是否允许打印（默认允许）
}
