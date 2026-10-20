import { ApiResponse, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import { HEADER_AUTHORIZATION, HEADER_TRACE_ID, HEADER_USER_ACCOUNT, HEADER_USER_ID, PAGE_PATH_LOGIN } from '@/service/constant'
import { BusinessError } from '@/utils/business-error'
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
  // 记录原地址，重新登录后可回到该页面
  const redirectQuery = fullPath && fullPath !== path && path !== PAGE_PATH_LOGIN ? { redirect: fullPath } : undefined
  try {
    try {
      await useUserInfoStore().logout()
    } catch (error) {
      // 清理失败不阻断后续跳转，否则会滞留在失效会话中
      console.error('会话清理失败:', error)
    }
    if (path !== PAGE_PATH_LOGIN) {
      await router.replace({ path: PAGE_PATH_LOGIN, query: redirectQuery })
    }
  } catch (error) {
    // 兜底：SPA 路由不可用时整页跳转，并保留 redirect 信息
    console.error('登录页跳转失败，改用整页跳转:', error)
    const search = redirectQuery?.redirect ? `?redirect=${encodeURIComponent(redirectQuery.redirect)}` : ''
    window.location.replace(`${PAGE_PATH_LOGIN}${search}`)
  } finally {
    sessionExpiredHandling = false
  }
  // 提示失败不影响会话清理结果，单独兜底避免返回的 Promise 变为拒绝态
  // 文案完全透传后端 msg，后端未提供时不额外补充提示
  try {
    if (message) {
      useMessage().error(message)
    }
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
    // 请求未能发出（配置异常等），此处不补充文案，交由调用方与日志定位
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 提示错误信息
 *
 * 约定：后端仅 200 为成功，其余状态码一律视为失败，错误文案完全透传后端 msg，
 * 不改写、不映射、不补充兜底文案；msg 为空时不展示提示。
 *
 * @param message 后端返回的错误信息
 */
const showErrorMessage = (message?: string) => {
  if (message) {
    useMessage().error(message)
  }
}

/**
 * 响应拦截器：处理响应数据、错误状态码等
 *
 * 保持 axios 原生返回契约（始终返回 AxiosResponse），
 * 业务信封的解包由下方 request<T>() 统一完成，避免类型系统与运行时脱节。
 * 业务失败统一抛出 BusinessError，携带 code 与 data，便于调用方分支处理。
 */
service.interceptors.response.use(
  async (response: AxiosResponse<ApiResponse>) => {
    const { responseType } = response.config
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response
    }
    const { code, msg, dataType, data } = response.data
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
      throw new BusinessError(code, msg ?? '', data)
    }
    showErrorMessage(msg)
    throw new BusinessError(code, msg ?? '', data)
  },
  async (error: AxiosError<ApiResponse>): Promise<never> => {
    // 已登录状态下返回 401，按登录态失效处理（公开接口不触发）
    const status = error.response?.status
    if (status === 401 && !error.config?.skipToken && useUserInfoStore().hasToken) {
      const message = error.response?.data?.msg
      // 同上：会话处理完成后再把异常交给调用方
      await handleSessionExpired(message)
      throw new BusinessError(401, message ?? '', error.response?.data?.data)
    }
    // 有响应时透传后端 msg；无响应（网络中断/超时）时透传 axios 原始错误信息
    const message = error.response ? error.response.data?.msg : error.message
    showErrorMessage(message)
    console.error('响应拦截器错误:', error)
    throw new BusinessError(status ?? 0, message ?? '', error.response?.data?.data)
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
 * @returns 原始响应 Promise；使用 arraybuffer 时请显式指定泛型 `requestBlob<ArrayBuffer>`
 */
export async function requestBlob<T = Blob>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return service.request<T>(config)
}

export default request
