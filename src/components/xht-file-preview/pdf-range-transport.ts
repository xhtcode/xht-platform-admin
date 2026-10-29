import { PDFDataRangeTransport } from 'pdfjs-dist'

/**
 * PDF 取流结果
 *
 * pdf.js 自身（`url` 方式）的首个请求必然是不带 Range 的整包 GET：它要先拿到
 * `Content-Length` 与 `Accept-Ranges` 才能判断能否分段，等于无论如何都会整包下载一遍。
 * 需要「第一个字节就带 Range」时只能由调用方接管取流，结果通过本结构回传。
 */
export interface XhtPdfRangeSource {
  range: PDFDataRangeTransport | null // 服务端支持 Range 时的分段加载器（与 data 二选一）
  data: ArrayBuffer | null // 服务端不支持 Range 时的整包数据（与 range 二选一）
  head: Uint8Array | null // 文件头部字节（首块/整包开头），用于探测线性化等文件特征
}

/**
 * 解析 `Content-Range` 响应头中的文件总长度
 *
 * 形如 `bytes 0-262143/2598235`，斜杠后为总长度；无法解析时返回 0。
 *
 * @param contentRange Content-Range 响应头
 */
const parseTotalLength = (contentRange: string | null): number => {
  const total = Number(contentRange?.split('/')[1])
  return Number.isInteger(total) && total > 0 ? total : 0
}

/**
 * 带鉴权头的分段加载器：按 pdf.js 请求的区间逐段拉取，避免整包下载
 */
class XhtPdfRangeTransport extends PDFDataRangeTransport {
  private readonly url: string // 文件地址
  private readonly headers: Record<string, string> // 请求头（鉴权等）
  private readonly onProgress?: (loaded: number, total: number) => void // 分段加载进度回调
  private readonly controller = new AbortController() // 文档销毁时中断未完成的分段请求
  private loaded: number // 已拉取字节数（近似值，区间可能重叠）

  constructor(
    length: number,
    initialData: Uint8Array,
    url: string,
    headers: Record<string, string>,
    onProgress?: (loaded: number, total: number) => void,
  ) {
    super(length, initialData, false)
    this.url = url
    this.headers = headers
    this.onProgress = onProgress
    this.loaded = initialData.byteLength
  }

  /**
   * 拉取指定区间（end 为开区间，需转成闭区间发给服务端）
   *
   * @param begin 起始字节（含）
   * @param end   结束字节（不含）
   */
  async requestDataRange(begin: number, end: number): Promise<void> {
    try {
      const response = await fetch(this.url, {
        headers: { ...this.headers, Range: `bytes=${begin}-${end - 1}` },
        credentials: 'include',
        signal: this.controller.signal,
      })
      if (!response.ok) {
        throw new Error(`分段请求失败（HTTP ${response.status}）`)
      }
      const chunk = new Uint8Array(await response.arrayBuffer())
      this.loaded += chunk.byteLength
      this.onProgress?.(this.loaded, this.length)
      this.onDataRange(begin, chunk)
    } catch (error) {
      // 失败时回空块结束该段：否则 pdf.js 的读取任务会永久挂起，比直接报错更难排查
      console.error('PDF 分段加载失败:', error)
      this.onDataRange(begin, new Uint8Array(0))
    }
  }

  /**
   * 中断所有未完成的分段请求（文档销毁时由 pdf.js 调用）
   */
  abort(): void {
    this.controller.abort()
  }
}

/**
 * 创建 PDF 取流源：首个请求即带 Range，仅取首块探测服务端是否支持分段
 *
 * - 返回 206 且能读到总长度：交由分段加载器按需续取剩余区间；
 * - 返回 200 或总长度不可解析（如跨域时 Content-Range 未暴露）：整包回退，交给 pdf.js 本地解析。
 *
 * @param url         文件地址
 * @param httpHeaders 请求头（鉴权等）
 * @param chunkSize   首块字节数，与 pdf.js 的 rangeChunkSize 保持一致
 * @param onProgress  分段加载进度回调（loaded 为已拉取字节数，total 为文件总长度）
 */
export const createPdfRangeSource = async (
  url: string,
  httpHeaders: Record<string, string>,
  chunkSize: number,
  onProgress?: (loaded: number, total: number) => void,
): Promise<XhtPdfRangeSource> => {
  const response = await fetch(url, {
    headers: { ...httpHeaders, Range: `bytes=0-${chunkSize - 1}` },
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`预览请求失败（HTTP ${response.status}）`)
  }
  const total =
    response.status === 206 ? parseTotalLength(response.headers.get('Content-Range')) : 0
  if (total) {
    const initialData = new Uint8Array(await response.arrayBuffer())
    onProgress?.(initialData.byteLength, total)
    return { range: new XhtPdfRangeTransport(total, initialData, url, httpHeaders, onProgress), data: null, head: initialData }
  }
  // 服务端不支持分段（或跨域下 Content-Range 不可读）：首块只是残缺数据，必须整包重取
  const full = await fetch(url, { headers: httpHeaders, credentials: 'include' })
  if (!full.ok) {
    throw new Error(`预览请求失败（HTTP ${full.status}）`)
  }
  const data = await full.arrayBuffer()
  return { range: null, data, head: new Uint8Array(data, 0, Math.min(data.byteLength, 65536)) }
}
