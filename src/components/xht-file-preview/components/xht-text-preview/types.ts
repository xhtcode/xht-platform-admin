/**
 * 文本预览属性
 */
export interface XhtTextPreviewProps {
  fileStorageKey: string // 文件存储key
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

/**
 * 文本预览请求参数
 */
export interface TextPreviewQuery {
  fileStorageKey: string // 文件存储key
  offset?: number // 上一页返回的游标，续读时必须原样回传
  size?: number // 单页字节数（后端限制 4096~262144，缺省 65536）
  charset?: string // 首屏之后回传服务端探测的编码，可省一次 8KB 采样读
  signal?: AbortSignal // 取消信号（切文件 / 卸载时中断在途请求）
}
