/**
 * 其它类型文件属性
 *
 * 浏览器无法内联渲染的文件（Office、压缩包、可执行文件等）统一走下载，
 * 因此只收下载与展示所需的最小信息，不接收预览地址。
 */
export interface XhtOtherPreviewProps {
  previewId: string // 预览ID（下载凭证）
  fileName?: string // 文件名称
  downloadable: boolean // 是否允许下载（分享「仅查看」时为 false）
}
