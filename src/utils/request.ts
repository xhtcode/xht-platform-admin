import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import {
  HEADER_AUTHORIZATION,
  HEADER_TRACE_ID,
  HEADER_USER_ACCOUNT,
  HEADER_USER_ID,
} from '@/common/constant'

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BASE_API, // 默认地址请求地址，可在 .env.** 文件中修改
  timeout: 50000, // 设置超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  withCredentials: true, // 跨域时候允许携带凭证
  paramsSerializer: {
    serialize: (params: any) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  },
}
/**
 * 创建 axios 实例
 */
const service = axios.create(config)
service.defaults.params = { _t: new Date().getTime() }
// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userInfoStore = useUserInfoStore()
    if (!config.headers.auth && userInfoStore.hasToken) {
      config.headers.set(HEADER_AUTHORIZATION, `Bearer ${userInfoStore.getToken}`)
    }
    config.headers.set(HEADER_TRACE_ID, '1123')
    config.headers.set(HEADER_USER_ACCOUNT, userInfoStore.getUserId)
    config.headers.set(HEADER_USER_ID, userInfoStore.getUserName)
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
    if (response.config.responseType === 'blob') {
      return response
    }
    const { code, msg } = response.data
    // 登录成功
    if (code === 200) {
      return response.data
    } else {
      useMessage().error(msg || '系统出错')
    }
    return Promise.reject(new Error(msg || 'Error'))
  },
  async (error: any) => {
    // 非 2xx 状态码处理 401、403、500 等
    const response = error.response
    if (response) {
      const { msg } = response.data
      useMessage().error(msg || '系统出错')
    }
    return Promise.reject(error.response?.data)
  },
)

// 导出 axios 实例
export default service
