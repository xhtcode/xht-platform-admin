/**
 * 扩展 axios 类型定义，可自行扩展
 */
declare module 'axios' {
  /**
   * 统一响应结构
   */
  export interface ApiResponse<T = unknown> {
    /** 业务状态码，200 表示成功 */
    code: number
    /** 提示信息 */
    msg: string
    /** 业务数据 */
    data: T
    /** 是否为加密数据：0 非加密 1 加密 */
    dataType: 0 | 1
    /** 是否成功，向后兼容保留 */
    success?: boolean
  }

  /**
   * 扩展请求配置
   */
  export interface AxiosRequestConfig<D = any> {
    /** 跳过访问令牌注入，用于登录、验证码等公开接口 */
    skipToken?: boolean
  }
}

export {}
