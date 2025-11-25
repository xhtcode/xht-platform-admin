import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import {
  HEADER_AUTHORIZATION,
  HEADER_TRACE_ID,
  HEADER_USER_ACCOUNT,
  HEADER_USER_ID,
} from '@/service/constant'
import { generateUUID } from '@/utils/index'

// 默认配置
const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BASE_API, // 从环境变量获取基础地址
  timeout: 50000, // 超时时间
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  withCredentials: true, // 跨域携带凭证
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
}

/**
 * 创建Axios实例
 */
const service = axios.create(defaultConfig)

// 添加防缓存时间戳参数
service.defaults.params = {
  _t: Date.now(), // 避免GET请求缓存
}

/**
 * 请求拦截器：处理请求头、认证信息等
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const userStore = useUserInfoStore()

    // 设置认证信息（跳过不需要认证的请求）
    if (!config.headers?.auth && userStore.hasToken) {
      config.headers.set(HEADER_AUTHORIZATION, `Bearer ${userStore.getToken}`)
    }

    // 设置链路追踪ID
    config.headers.set(HEADER_TRACE_ID, generateUUID())

    // 修正用户信息头映射（避免原代码中的赋值错误）
    if (userStore.getUserId) {
      config.headers.set(HEADER_USER_ID, userStore.getUserId)
    }
    if (userStore.getUserName) {
      config.headers.set(HEADER_USER_ACCOUNT, userStore.getUserName)
    }

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    useMessage().error('请求准备失败，请稍后重试')
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器：处理响应数据、错误状态码等
 */
service.interceptors.response.use(
  (response: AxiosResponse): any => {
    // 处理JSON响应
    const { code } = response.data
    // 成功状态码（根据实际业务调整）
    if (code === 200) {
      return response.data
    }
    return response.data
  },
  ({ response }: any): Promise<any> => {
    let errorMsg = response?.data?.msg ?? response?.statusText ?? '网络请求失败，请检查网络连接'
    // 特定状态码处理
    if (response) {
      switch (response.status) {
        case 401:
          // 未授权：跳转登录页（根据实际路由调整）
          useUserInfoStore()
            .logout()
            .then(() => {})
          window.location.href = '/login'
          break
        case 403:
          errorMsg = '没有操作权限，请联系管理员'
          break
      }
    }
    useMessage().error(errorMsg)
    return Promise.reject(response)
  }
)

export default service
