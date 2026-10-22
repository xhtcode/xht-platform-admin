import { defineStore } from 'pinia'
import type { LoginRequestType, PhoneLoginFormType } from '@/service/model/login/login.model'
import { loginInPassWord, loginInPhone, logoutToken } from '@/service/api/login/login.api'
import type { ApiResponse } from 'axios'
import pInIaPersistConfig, { clearSessionPersist } from '@/store/pinia-persist'
import { getUserInfo } from '@/service/api/permission/user.profile.api'
import { userTypeEnum } from '@/service/enums/system/user.enum'

/**
 * 用户信息store
 */
export const useUserInfoStore = defineStore(
  'user_info',
  (): UserStoreType => {
    /**
     * 用户信息状态
     */
    const userInfo = ref<UserInfoType>({
      roleCodes: [],
      menuButtonCodes: [],
    })

    /**
     * 认证令牌状态
     */
    const token = ref<TokenInfoType>({
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
     * 合并写入认证令牌
     *
     * 按字段合并写入：接口未返回的字段沿用原值，避免令牌信息被部分字段覆盖。
     *
     * @param data 令牌字段
     */
    function applyToken(data: Partial<TokenInfoType>) {
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
    async function login(data: LoginRequestType): Promise<void> {
      return new Promise((resolve, reject) => {
        loginInPassWord(data)
          .then((res: ApiResponse<TokenInfoType>) => {
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
    async function loginByPhone(data: PhoneLoginFormType): Promise<void> {
      const res = await loginInPhone(data)
      applyToken(res.data)
    }

    /**
     * 用户登出方法
     *
     * 先请求服务端注销令牌（失败不阻断），再清除本地认证信息、动态路由与页签数据。
     *
     * @param revokeRemote 是否请求服务端注销令牌；令牌已失效时传 false，避免无效请求
     * @returns Promise<void>
     */
    async function logout(revokeRemote = true): Promise<void> {
      // 注销接口依赖请求头中的访问令牌，必须在清理本地令牌之前调用
      if (revokeRemote && token.value.access_token) {
        try {
          await logoutToken()
        } catch (error) {
          // 服务端注销失败（令牌已失效、网络异常等）不阻断本地退出
          console.warn('注销令牌失败，继续清理本地会话:', error)
        }
      }
      // 动态导入：避免 user.store -> routes.store -> api -> request -> user.store 的静态循环依赖
      const [{ useRouteStore }, { default: useTagsStore }] = await Promise.all([
        import('@/store/modules/routes.store'),
        import('@/store/modules/tags.store'),
      ])
      // 先移除动态路由并复位生成标记，否则重新登录后不会重新生成菜单
      useRouteStore().resetRoutes()
      // 页签指向的路由已被移除，同步清空，避免残留失效链接
      const tagsStore = useTagsStore()
      tagsStore.activeName = null
      tagsStore.visitedViews = []
      userInfo.value = {
        roleCodes: [],
        menuButtonCodes: [],
      }
      token.value = {
        scope: [],
        additional_parameters: {},
      }
      // 仅清理登录态相关的持久化数据，保留主题、布局等偏好
      clearSessionPersist()
    }

    /**
     * 获取用户信息方法
     * 从服务端获取当前登录用户的信息
     * @returns Promise<void>
     */
    function getUserInfos(): Promise<void> {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: ApiResponse<UserInfoType>) => {
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
      login,
      loginByPhone,
      logout,
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
