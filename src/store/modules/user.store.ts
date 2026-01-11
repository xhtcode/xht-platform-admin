import { defineStore } from 'pinia'
import type { LoginRequestType } from '@/service/model/login/login.model'
import { loginInPassWord } from '@/service/api/login/login.api'
import type { AxiosResponse } from 'axios'
import { resetRouter } from '@/router'
import { useMessageBox } from '@/hooks/use-message'
import pInIaPersistConfig from '@/store/pinia-persist'
import { getUserInfo } from '@/service/api/permission'
import _ from 'lodash'

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
    const isAdmin = computed<boolean>(() => _.includes(userInfo.value.roleCodes, 'admin'))

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
     * 用户登录方法
     * 通过用户名密码进行登录，获取认证令牌
     * @param data 登录请求数据
     * @returns Promise<void>
     */
    async function login(data: LoginRequestType): Promise<void> {
      return new Promise((resolve, reject) => {
        loginInPassWord(data)
          .then((res: AxiosResponse<TokenInfoType>) => {
            token.value = res.data
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }

    /**
     * 用户登出方法
     * 清除用户认证信息并重置路由
     * @returns Promise<void>
     */
    function logout() {
      return resetToken()
    }

    /**
     * 获取用户信息方法
     * 从服务端获取当前登录用户的信息
     * @returns Promise<void>
     */
    function getUserInfos(): Promise<void> {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: AxiosResponse<UserInfoType>) => {
            userInfo.value = res.data
            resolve()
          })
          .catch((_) => {
            useMessageBox()
              .confirm('用户信息获取失败,请重新登录!')
              .then(async () => {
                await resetToken()
              })
            reject()
          })
      })
    }

    /**
     * 重置用户认证信息方法
     * 清除用户信息、认证令牌及本地存储，并重置路由
     * @returns Promise<void>
     */
    async function resetToken(): Promise<void> {
      return new Promise<void>(async (resolve) => {
        userInfo.value = {
          roleCodes: [],
          menuButtonCodes: [],
        }
        token.value = {
          scope: [],
          additional_parameters: {},
        }
        window.sessionStorage.clear()
        window.localStorage.clear()
        resetRouter().then(() => {
          resolve()
        })
      })
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
      logout,
      getUserInfos,
      resetToken,
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
