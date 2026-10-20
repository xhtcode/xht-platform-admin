import { ApiResponse, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import { HEADER_AUTHORIZATION, HEADER_TRACE_ID, HEADER_USER_ACCOUNT, HEADER_USER_ID, PAGE_PATH_LOGIN } from '@/service/constant'
import { generateUUID } from '@/utils/index'
import router from '@/router/index'
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

/**
 * 会话失效处理中标记
 * 避免并发请求同时返回 424/401 时重复弹窗与重复跳转
 */
let sessionExpiredHandling = false

/**
 * 统一处理登录态失效
 *
 * 先清理认证信息与动态路由，再跳转登录页并携带原地址，
 * 避免遗留 token、菜单或页签导致重新登录后状态异常。
 *
 * 该函数保证不抛错（内部已兜底），调用方应等待其完成后再向上抛出请求异常，
 * 以确保调用方捕获错误时会话状态已完成复位。
 *
 * @param message 提示文案
 * @returns 会话清理与跳转完成的 Promise
 */
const handleSessionExpired = async (message?: string): Promise<void> => {
  if (sessionExpiredHandling) {
    return
  }
  sessionExpiredHandling = true
  const { path, fullPath } = router.currentRoute.value
  try {
    await useUserInfoStore().logout()
    if (path !== PAGE_PATH_LOGIN) {
      await router.replace({
        path: PAGE_PATH_LOGIN,
        query: fullPath && fullPath !== path ? { redirect: fullPath } : undefined,
      })
    }
  } catch (error) {
    // 兜底：跳转失败时直接刷新到登录页，确保不会停留在失效会话中
    console.error('会话失效处理失败:', error)
    window.location.replace(PAGE_PATH_LOGIN)
  } finally {
    sessionExpiredHandling = false
  }
  // 提示失败不影响会话清理结果，单独兜底避免返回的 Promise 变为拒绝态
  try {
    useMessage().error(message || '登录状态已失效，请重新登录')
  } catch (error) {
    console.error('会话失效提示失败:', error)
  }
}

/**
 * 请求拦截器：处理请求头、认证信息等
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const userStore = useUserInfoStore()
    const { userInfo, hasToken, getAccessToken } = storeToRefs(userStore)
    // 设置认证信息（登录、验证码等公开接口通过 skipToken 跳过）
    if (!config.skipToken && hasToken.value) {
      config.headers.set(HEADER_AUTHORIZATION, `Bearer ${getAccessToken.value}`)
    }
    // 设置链路追踪ID
    config.headers.set(HEADER_TRACE_ID, generateUUID())
    // 设置用户上下文头
    if (userInfo.value?.userId) {
      config.headers.set(HEADER_USER_ID, userInfo.value.userId)
    }
    if (userInfo.value?.userName) {
      config.headers.set(HEADER_USER_ACCOUNT, userInfo.value.userName)
    }
    // GET 请求追加时间戳，避免浏览器缓存
    if (config.method?.toLowerCase() === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }
    return config
  },
  async (error: AxiosError): Promise<never> => {
    useMessage().error('请求准备失败，请稍后重试')
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器：处理响应数据、错误状态码等
 *
 * 保持 axios 原生返回契约（始终返回 AxiosResponse），
 * 业务信封的解包由下方 request<T>() 统一完成，避免类型系统与运行时脱节。
 */
service.interceptors.response.use(
  async (response: AxiosResponse<ApiResponse>) => {
    const { responseType } = response.config
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response
    }
    const { code, msg, dataType } = response.data
    // 如果是加密数据
    if (dataType === 1) {
      useMessage().error('加密暂未实现')
    }
    if (code === 200) {
      return response
    }
    if (code === 424 && !response.config.skipToken) {
      // 等待会话清理与跳转完成后再抛出，避免调用方在会话状态尚未复位时继续处理
      await handleSessionExpired(msg)
      throw new Error(msg || '登录状态已失效，请重新登录')
    }
    useMessage().error(msg)
    throw new Error(msg || '系统出错')
  },
  async (error: AxiosError<ApiResponse>): Promise<never> => {
    // 已登录状态下返回 401，按登录态失效处理（公开接口不触发）
    const status = error.response?.status
    if (status === 401 && !error.config?.skipToken && useUserInfoStore().hasToken) {
      // 同上：会话处理完成后再把原始错误交给调用方
      await handleSessionExpired(error.response?.data?.msg)
      return Promise.reject(error.response)
    }
    // 优先使用后端返回的提示，避免把 4xx/5xx 误报为网络异常
    const responseMessage = error.response?.data?.msg
    if (responseMessage) {
      useMessage().error(responseMessage)
    } else if (error.message?.includes('timeout')) {
      useMessage().error('服务器正在伸懒腰，请稍后再来~')
    } else if (error.message === 'Network Error') {
      useMessage().error('请求传递过程中超时了，就像寄快递路上堵车了~')
    } else if (error.message?.includes('Request')) {
      useMessage().error('网络连接异常，请求未成功发送，请检查网络后重试~')
    }
    console.error('响应拦截器错误:', error)
    return Promise.reject(error.response)
  }
)

/**
 * 统一业务请求
 *
 * 响应拦截器保持 axios 原生返回，业务信封（ApiResponse）的解包在此统一完成，
 * 使调用方拿到的类型与实际运行时结构完全一致。
 *
 * @param config 请求配置
 * @returns 业务信封 Promise
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await service.request<ApiResponse<T>>(config)
  return response.data
}

/**
 * 文件流请求
 *
 * blob/arraybuffer 响应不经过业务信封解包，直接返回原始响应对象，
 * 调用方可读取响应头与二进制 data。
 *
 * @param config 请求配置（需将 responseType 设置为 blob 或 arraybuffer）
 * @returns 原始响应 Promise
 */
export async function requestBlob(config: AxiosRequestConfig): Promise<AxiosResponse<Blob>> {
  return service.request<Blob>(config)
}

export default request
