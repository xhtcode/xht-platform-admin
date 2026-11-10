import { requestBlob } from '@/utils/request'
import { BusinessError } from '@/utils/business-error'
import { toSysFileAbsoluteUrl } from '@/service/api/system/file.api'

/**
 * 预览内容地址拼接
 *
 * 服务端下发的 `urls.*` 是站内相对路径（以 `/sys` 开头），
 * 而 `<img>` / `<video>` / `fetch` 等浏览器原生请求不走 axios 的 baseURL，需要补上网关前缀。
 *
 * @param url 服务端下发的相对地址
 * @returns 浏览器可直接访问的绝对路径
 */
export const toPreviewUrl = (url: string): string => toSysFileAbsoluteUrl(url)

/**
 * 预览二进制接口的业务异常
 *
 * 与拦截器抛出的 `BusinessError` 区分：二进制接口（内容 / 下载）的业务错误绕过了拦截器，
 * 尚未向用户提示过消息，调用方需要自行提示一次；而拦截器抛出的异常已提示过，不可重复弹。
 */
export class PreviewApiError extends BusinessError {
  constructor(code: number, message: string) {
    super(code, message)
    this.name = 'PreviewApiError'
  }
}

/**
 * 识别后端统一业务错误信封
 *
 * 预览内容与下载接口成功时返回二进制流，失败时仍以 **HTTP 200** 返回 `{ code, msg }`，
 * 因此不能只看 HTTP 状态码；此处按 `application/json` 内容类型嗅探并转成业务异常。
 *
 * @param blob 响应体
 * @returns 业务异常对象；非错误响应返回 null
 */
export const parsePreviewBusinessError = async (blob: Blob): Promise<PreviewApiError | null> => {
  if (!blob.type.includes('json')) return null
  try {
    const body = JSON.parse(await blob.text()) as { code?: number; msg?: string }
    if (typeof body.code === 'number') {
      return new PreviewApiError(body.code, body.msg ?? '')
    }
  } catch (error) {
    // 内容不是合法 JSON：按正常响应处理，交由预览器自身的解析逻辑报错
    console.error('预览响应体解析失败:', error)
  }
  return null
}

/**
 * 读取预览内容文本（JSON / 文本类需要二次处理的场景）
 *
 * @param previewUrl 预览内容地址（已含 previewId）
 * @returns 文件文本内容
 */
export const readPreviewText = async (previewUrl: string): Promise<string> => {
  const response = await requestBlob({
    url: previewUrl,
    baseURL: import.meta.env.VITE_ADMIN_API_PREFIX,
    method: 'get',
    responseType: 'blob',
  })
  const error = await parsePreviewBusinessError(response.data)
  if (error) throw error
  return response.data.text()
}

/**
 * 会话过期错误码：预览会话 TTL 到期后所有预览接口统一返回该码
 */
export const FILE_PREVIEW_SESSION_EXPIRED = 50221

/**
 * 判断是否为「预览会话已过期」
 *
 * @param error 捕获到的异常
 */
export const isPreviewSessionExpired = (error: unknown): boolean => {
  return error instanceof BusinessError && error.code === FILE_PREVIEW_SESSION_EXPIRED
}
