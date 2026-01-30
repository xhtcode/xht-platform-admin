import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import _ from 'lodash'
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
    if (userInfo.value?.userId) {
      config.headers.set(HEADER_USER_ID, userInfo.value.userId)
    }
    if (userInfo.value?.userName) {
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
    const contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type']
    if (contentType?.indexOf('application/json') === -1) {
      return response
    }
    // 如果是加密数据
    if (response.data.dataType === 10) {
      response.data.encryptData = response.data.data
      const decryptStr = JSON.stringify(response.data.data)
      if (decryptStr) {
        response.data.data = JSON.parse(decryptStr)
      }
    }
    if (response.data.code && response.data.code !== 200) {
      if (response.data.code === 424) {
        logout()
        return Promise.reject(response.data)
      }
      useMessage().error(response.data.msg)
      return Promise.reject(response.data)
    }
    return Promise.resolve(response.data)
  },
  (error: any): Promise<any> => {
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') !== -1) {
      useMessage().error('服务器正在伸懒腰，请稍后再来~')
    } else if (error.message === 'Network Error') {
      useMessage().error('请求传递过程中超时了，就像寄快递路上堵车了~')
    } else if (error.message.indexOf('Request') !== -1) {
      useMessage().error('网络连接异常，请求未成功发送，请检查网络后重试~')
    }
    return Promise.reject(error.response)
  }
)

/**
 * 退出登录
 */
const logout = () => {
  // 未授权：跳转登录页（根据实际路由调整）
  useUserInfoStore()
    .logout()
    .then(() => {})
  window.location.href = '/login'
}

export default service
