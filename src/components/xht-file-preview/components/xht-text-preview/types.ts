/**
 * 文本预览属性
 *
 * 文本内容走 `/sys/files/preview/content` 的 JSON 分页接口，凭证是预览ID（不是文件地址）。
 */
export interface XhtTextPreviewProps {
  previewId: string // 预览ID
}

/**
 * 文本预览分页数据
 *
 * 后端按字节分页读取：`offset` 为本页结束位置，也是下一页的起始游标。
 */
export interface TextPreviewPage {
  content: string // 本页文本内容
  offset: number // 下一页游标（本页结束字节位置）
  current: number // 当前页码（从 1 开始）
  size: number // 单页字节数
  pages: number // 总页数（按 total / size 估算）
  total: number // 文件总字节数
  hasMore: boolean // 是否还有下一页
  charset?: string // 服务端探测到的字符编码（空文件 / 已读到末尾时后端不返回）
}
