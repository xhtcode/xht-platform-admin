/**
 * 业务异常
 *
 * 请求层在 HTTP 请求成功但业务码非 200（或 HTTP 层报错）时抛出该类型，
 * 使调用方能按业务状态码做分支处理，而不是只拿到一段文案：
 *
 * ```ts
 * try {
 *   await removeDict(id)
 * } catch (error) {
 *   if (isBusinessError(error) && error.code === 50104) {
 *     // 字典下存在字典项，引导用户先去删除字典项
 *   }
 * }
 * ```
 */
export class BusinessError extends Error {
  /** 后端业务状态码；无响应（如网络中断）时为 0 */
  readonly code: number

  /** 后端返回的业务数据（如校验失败的字段明细） */
  readonly data?: unknown

  constructor(code: number, message: string, data?: unknown) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.data = data
  }
}

/**
 * 判断是否为业务异常
 * @param error 捕获到的任意异常
 */
export const isBusinessError = (error: unknown): error is BusinessError => error instanceof BusinessError
