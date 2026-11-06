/**
 * 其它类型文件属性
 *
 * 浏览器无法内联渲染的文件（Office、压缩包、可执行文件等）统一走下载，
 * 因此只收下载与展示所需的最小信息，不接收预览地址。
 */
export interface XhtOtherPreviewProps {
  fileStorageKey: string // 文件存储key（下载接口使用）
  fileName?: string // 文件名称（缺省回退为存储key）
}
