/**
 * 扩展 axios 数据返回类型，可自行扩展
 */
declare module 'axios' {
  /**
   * 扩展返回值
   */
  export interface ApiResponse<T = any> {
    success: boolean
    code: number
    data: T
    message: string
    dataType: 0 | 1

    [key: string]: any
  }
}

export {}
