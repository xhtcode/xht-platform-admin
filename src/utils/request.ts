import { ApiResponse, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useMessage } from '@/hooks/use-message'
import qs from 'qs'
import { useUserInfoStore } from '@/store/modules/user.store'
import { HEADER_AUTHORIZATION, HEADER_TRACE_ID, HEADER_USER_ACCOUNT, HEADER_USER_ID, PAGE_PATH_LOGIN } from '@/service/constant'
import { generateUUID } from '@/utils/index'
import router from '@/router/index'
import { storeToRefs } from 'pinia'
import useLogoutStore from '@/hooks/use-logout-store.ts'
import { useRoute } from 'vue-router'

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
 * 统一 HTTP 请求客户端
 *
 * 以类封装 axios 实例与拦截器，对外仅暴露 request / requestRaw / requestBlob 三个入口。
 * 响应拦截器保持 axios 原生返回契约（始终返回 AxiosResponse），业务信封的解包由各入口方法统一完成。
 */
class XhtHttpRequest {
  private readonly _config: AxiosRequestConfig
  private readonly axiosInstance: AxiosInstance

  constructor(configInfo: AxiosRequestConfig) {
    this._config = configInfo
    this.axiosInstance = axios.create(configInfo)
    this.initRequest()
    this.initResponse()
  }

  get config(): AxiosRequestConfig {
    return this._config
  }

  /**
   * 初始化请求拦截器：处理请求头、认证信息等
   * @private
   */
  private initRequest() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const userStore = useUserInfoStore()
        const { userInfo, hasToken, getAccessToken } = storeToRefs(userStore)
        console.log('userStore', userStore.userInfo, hasToken)
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
      (error: AxiosError): Promise<never> => {
        // 请求未能发出（配置异常等），此处不补充文案，交由调用方与日志定位
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 初始化响应拦截器
   *
   * 保持 axios 原生返回契约（始终返回 AxiosResponse），
   * 业务信封的解包由 request<T>() 统一完成，避免类型系统与运行时脱节。
   * 业务失败统一抛出 BusinessError，携带 code 与 data，便于调用方分支处理。
   * @private
   */
  private initResponse() {
    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse<ApiResponse>): Promise<AxiosResponse> => {
        const { responseType, rawResponse } = response.config
        // - blob/arraybuffer：二进制内容不存在 code/msg 字段
        // - rawResponse：后端未按统一信封返回（无 code），判定业务码只会误判为失败
        if (rawResponse || responseType === 'blob' || responseType === 'arraybuffer') {
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
        useMessage().error(msg)
        throw response
      },
      async (error: AxiosError<ApiResponse>): Promise<any> => {
        const response = error.response
        if (response) {
          const { status, data, config } = response
          // 401 统一在此收口，不再向下走通用错误提示，避免"未登录"提示重复弹
          console.log('response', config.skipTip, !config.skipTip)
          if (status === 401) {
            if (!config.skipTip) {
              ElMessageBox.confirm('令牌状态已过期，请点击重新登录', '登录已失效', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false,
              }).then(() => {
                useLogoutStore().resetAllStores()
                router.replace(PAGE_PATH_LOGIN)
                return
              })
            }
            return Promise.reject(response)
          }
          if (data) {
            useMessage().error(data.msg)
            return Promise.reject(data)
          }
        }
        if (error.message?.indexOf('timeout') !== -1) {
          useMessage().error('服务器正在伸懒腰，请稍后再来~')
        } else if (error.message === 'Network Error') {
          useMessage().error('请求传递过程中超时了，就像寄快递路上堵车了~')
        } else if (error.message?.indexOf('Request') !== -1) {
          useMessage().error('网络连接异常，请求未成功发送，请检查网络后重试~')
        } else {
          useMessage().error(error.message)
        }
        return Promise.reject(error.response)
      }
    )
  }

  /**
   * 统一业务请求
   *
   * 响应拦截器保持 axios 原生返回，业务信封（ApiResponse）的解包在此统一完成，
   * 使调用方拿到的类型与实际运行时结构完全一致。
   *
   * 注意：后端未按统一信封返回（无 code 字段）的接口不可用本方法，否则必然被判定为业务失败，
   * 请改用 `requestRaw()`。
   *
   * @param config 请求配置
   * @returns 业务信封 Promise
   */
  public async request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>(config)
    return response.data
  }

  /**
   * 原始响应请求
   *
   * 用于后端未使用统一业务信封（响应体没有 code 字段）的接口。
   * 此类接口无法按业务码判定成败，因此不做任何判定，直接把响应体交给调用方，
   * 失败仅由 HTTP 状态码体现（由拦截器的错误分支统一提示）。
   *
   * ```ts
   * // 后端直接返回 { name: 'x' }，没有 code/msg
   * const data = await requestRaw<{ name: string }>({ url: '/xxx', method: 'get' })
   * ```
   *
   * @param config 请求配置（内部强制 rawResponse，调用方无需重复声明）
   * @returns 响应体本身
   */
  public async requestRaw<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>({ ...config, rawResponse: true })
    return response.data
  }

  /**
   * 文件流请求
   *
   * blob/arraybuffer 响应不经过业务信封解包，直接返回原始响应对象，
   * 调用方可读取响应头与二进制 data。
   *
   * @param config 请求配置（内部强制 responseType: 'blob'）
   * @returns 原始响应 Promise；使用 arraybuffer 时请显式指定泛型 `requestBlob<ArrayBuffer>`
   */
  public async requestBlob<T = Blob>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>({ ...config, responseType: 'blob' })
  }
}

const httpRequest = new XhtHttpRequest(defaultConfig)

/**
 * 统一业务请求，详见 `XhtHttpRequest.request()`
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return httpRequest.request<T>(config)
}

/**
 * 原始响应请求，详见 `XhtHttpRequest.requestRaw()`
 */
export async function requestRaw<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return httpRequest.requestRaw<T>(config)
}

/**
 * 文件流请求，详见 `XhtHttpRequest.requestBlob()`
 */
export async function requestBlob<T = Blob>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return httpRequest.requestBlob<T>(config)
}

export default request
