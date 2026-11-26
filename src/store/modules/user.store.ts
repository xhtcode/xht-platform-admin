import { defineStore } from 'pinia'
import type { LoginRequest, PhoneLoginForm } from '@/service/model/login/login.model'
import { loginInPassWord, loginInPhone, logoutToken } from '@/service/api/login/login.api'
import type { ApiResponse } from 'axios'
import pInIaPersistConfig from '@/store/pinia-persist'
import { getUserProfileInfo } from '@/service/api/dashboard/user.profile.api'
import { userTypeEnum } from '@/service/enums/system/user.enum'

const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 用户信息store
 */
export const useUserInfoStore = defineStore(
  'user_info',
  (): UserStore => {
    /**
     * 用户信息状态
     */
    const userInfo = ref<UserInfo>({
      roleCodes: [],
      menuButtonCodes: [],
    })

    /**
     * 认证令牌状态
     */
    const token = ref<TokenInfo>({
      scope: [],
      additional_parameters: {},
    })

    /**
     * 是否为管理员
     */
    const isAdmin = computed<boolean>(() => userInfo.value.userType === userTypeEnum.ADMIN.value)

    /**
     * 是否存在访问令牌
     * 检查当前是否已登录
     */
    const hasToken = computed<boolean>(() => !!token.value.access_token)

    /**
     * 是否存在角色
     */
    const hasRoles = computed<boolean>(() => userInfo.value.roleCodes && userInfo.value.roleCodes.length > 0)

    /**
     * 获取访问令牌
     */
    const getAccessToken = computed<string>(() => token.value.access_token!)

    /**
     * 获取用户信息页面的计算属性
     */
    const getUserInfoPage = computed<string>(() => (isAdmin.value ? '/home/user/admin' : '/home/user'))

    /**
     * 获取用户头像预览地址
     */
    const getUserAvatar = computed<string>(() => {
      if (userInfo.value.userAvatar) {
        return baseURL + userInfo.value.userAvatar
      }
      return new URL('../../assets/images/avatar.png', import.meta.url).href
    })
    /**
     * 合并写入认证令牌
     *
     * 按字段合并写入：接口未返回的字段沿用原值，避免令牌信息被部分字段覆盖。
     *
     * @param data 令牌字段
     */
    function applyToken(data: Partial<TokenInfo>) {
      token.value = {
        access_token: data.access_token ?? token.value.access_token,
        refresh_token: data.refresh_token ?? token.value.refresh_token,
        token_type: data.token_type ?? token.value.token_type,
        expires_in: data.expires_in ?? token.value.expires_in,
        scope: data.scope ?? token.value.scope ?? [],
        additional_parameters: data.additional_parameters ?? token.value.additional_parameters ?? {},
      }
    }

    /**
     * 用户登录方法
     * 通过用户名密码进行登录，获取认证令牌
     * @param data 登录请求数据
     * @returns Promise<void>
     */
    async function login(data: LoginRequest): Promise<void> {
      return new Promise((resolve, reject) => {
        loginInPassWord(data)
          .then((res: ApiResponse<TokenInfo>) => {
            applyToken(res.data)
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }

    /**
     * 手机号验证码登录
     *
     * 登录成功后将访问令牌写入 store，持久化由 pinia 插件完成。
     *
     * @param data 手机号与验证码
     * @returns Promise<void>
     */
    async function loginByPhone(data: PhoneLoginForm): Promise<void> {
      const res = await loginInPhone(data)
      applyToken(res.data)
    }

    /**
     * 仅清理本地会话（不发请求，可重复调用）
     *
     * 用于令牌已失效的场景（401）：此时再调用注销接口只会再吃一次 401，
     * 因此只做本地收尾——移除动态路由、清空页签、复位全部 store、清理持久化缓存。
     */
    function clearSession(): void {
      userInfo.value = {
        roleCodes: [],
        menuButtonCodes: [],
      }
      token.value = {
        scope: [],
        additional_parameters: {},
      }
    }

    /**
     * 用户登出方法
     *
     * 只要本地仍有访问令牌，就先请求服务端注销令牌（失败不阻断），
     * 再清除本地认证信息、动态路由与页签数据。
     *
     * @returns Promise<void>
     */
    async function logout(): Promise<void> {
      // 注销接口依赖请求头中的访问令牌，必须在清理本地令牌之前调用
      if (token.value.access_token) {
        try {
          await logoutToken()
        } catch (error) {
          // 服务端注销失败（令牌已失效、网络异常等）不阻断本地退出
          console.warn('注销令牌失败，继续清理本地会话:', error)
        }
      }
      clearSession()
    }

    /**
     * 获取用户信息方法
     * 从服务端获取当前登录用户的信息
     * @returns Promise<void>
     */
    function getUserInfos(): Promise<void> {
      return new Promise((resolve, reject) => {
        getUserProfileInfo()
          .then((res: ApiResponse<UserInfo>) => {
            userInfo.value = res.data
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    }

    /**
     * 设置access_token
     */
    function setAccessToken(access_token: string) {
      token.value.access_token = access_token
    }

    return {
      userInfo,
      token,
      isAdmin,
      hasToken,
      hasRoles,
      getAccessToken,
      getUserInfoPage,
      getUserAvatar,
      login,
      loginByPhone,
      logout,
      clearSession,
      getUserInfos,
      applyToken,
      setAccessToken,
    }
  },
  {
    /**
     * 持久化配置
     * 将用户信息存储到本地存储中，以便在页面刷新后保持登录状态
     */
    persist: pInIaPersistConfig('user_info'),
  }
)
