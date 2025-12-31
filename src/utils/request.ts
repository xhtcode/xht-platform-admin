import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import { HEADER_AUTHORIZATION, HEADER_TRACE_ID, HEADER_USER_ACCOUNT, HEADER_USER_ID } from '@/service/constant'
import { generateUUID } from '@/utils/index'
import { storeToRefs } from 'pinia'

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
    const { userInfo, hasToken, getAccessToken } = storeToRefs(userStore)
    // 设置认证信息（跳过不需要认证的请求）
    if (!config.headers?.auth && hasToken.value) {
      config.headers.set(HEADER_AUTHORIZATION, `Bearer ${getAccessToken.value}`)
    }
    // 设置链路追踪ID
    config.headers.set(HEADER_TRACE_ID, generateUUID())
    // 修正用户信息头映射（避免原代码中的赋值错误）
    if (userInfo.value.userId) {
      config.headers.set(HEADER_USER_ID, userInfo.value.userId)
    }
    if (userInfo.value.userName) {
      config.headers.set(HEADER_USER_ACCOUNT, userInfo.value.userName)
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
    let errorMsg = response.data?.msg ?? response.statusText ?? '网络请求失败，请检查网络连接'
    // 特定状态码处理
    if (response) {
      switch (response.status) {
        case 401:
          if (response.data?.code === 424) {
            // 未授权：跳转登录页（根据实际路由调整）
            useUserInfoStore()
              .logout()
              .then(() => {})
            window.location.href = '/login'
          }
          break
        case 403:
          errorMsg = '没有操作权限，请联系管理员'
          break
      }
    }
    if (errorMsg == 'Network Error') {
      errorMsg = '后端接口连接异常'
    } else if (errorMsg.includes('timeout')) {
      errorMsg = '系统接口请求超时'
    } else if (errorMsg.includes('Request failed with status code')) {
      errorMsg = '系统服务未知异常'
    }
    useMessage().error(errorMsg)
    return Promise.reject(response.data)
  }
)

export default service
