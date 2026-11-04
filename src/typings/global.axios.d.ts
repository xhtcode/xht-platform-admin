/**
 * 扩展 axios 类型定义，可自行扩展
 */
declare module 'axios' {
  /**
   * 统一响应结构
   */
  export interface ApiResponse<T = unknown> {
    /** 业务状态码，200 表示成功；业务异常码见 doc/后端状态码 */
    code: number
    /** 提示信息 */
    msg: string
    /** 业务数据 */
    data: T
    /** 是否为加密数据：0 非加密 1 加密；后端未返回时按非加密处理 */
    dataType?: 0 | 1
    /** 加密响应体：dataType 为 1 时返回，前端需解密后再使用 */
    encryptData?: string
    /** 响应体类型标识（后端预留字段） */
    type?: string
    /** @deprecated 后端已不再返回，保留仅为兼容历史代码 */
    success?: boolean
  }

  /**
   * 扩展请求配置
   */
  export interface AxiosRequestConfig<D = any> {
    /** 跳过访问令牌注入，用于登录、验证码等公开接口 */
    skipToken?: boolean
    /**
     * 跳过业务信封解包
     *
     * 用于后端未使用统一信封（无 code/msg/data 结构）的接口：响应拦截器不再判定业务码，
     * 直接返回原始响应。此类请求的成功与否仅由 HTTP 状态码决定。
     *
     * 通常无需手动声明，直接使用 `requestRaw()` 即可。
     */
    skipEnvelope?: boolean
  }
}

export {}
