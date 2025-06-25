import { defineStore } from 'pinia'
import type { LoginRequestType } from '@/api/login/type'
import { getUserInfo, loginInPassWord } from '@/api/login/api'
import type { AxiosResponse } from 'axios'
import { resetRouter } from '@/router'
import { useMessageBox } from '@/hooks/use-message'
import pInIaPersistConfig from '@/store/pinia-persist'

const defaultState: UserInfoStoreType = {
  userId: null, // 用户id
  userName: null, // 用户名称
  userAccount: null, // 用户账号
  dataScope: null, // 数据权限
  roles: [], // 角色code
  authorities: [], // 权限code
  token: {
    access_token: null, // 访问令牌
    refresh_token: null, // 刷新令牌
    scope: [], // 授权范围
    token_type: null, // 访问令牌类型
    expires_in: null, // 令牌过期时间
    additional_parameters: {}, // 额外的参数
  },
}
/**
 * 主题相关pinia
 */
export const useUserInfoStore = defineStore('user_info', {
  state: (): UserInfoStoreType => ({
    ...defaultState,
  }),
  actions: {
    async login(data: LoginRequestType) {
      return new Promise((resolve, reject) => {
        loginInPassWord(data)
          .then((res: AxiosResponse<TokenInfoType>) => {
            this.token = { ...res.data }
            console.log(res.data)
            console.log(this.token)
            resolve(res.data)
          })
          .catch(() => {
            reject()
          })
      })
    },
    async logout() {
      this.token = {
        access_token: null,
        additional_parameters: {},
        expires_in: null,
        refresh_token: null,
        scope: [],
        token_type: null,
      }
    },
    getUserInfos(): Promise<unknown> {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: AxiosResponse<any>) => {
            const data: any = res.data
            // this.authorities = data.authorities
            // this.dataScope = data.dataScope
            this.roles = []
            resolve(true)
          })
          .catch((_) => {
            useMessageBox()
              .confirm('用户信息获取失败,请重新登录!')
              .then(async () => {
                await this.resetToken()
              })
            reject()
          })
      })
    },
    async resetToken() {
      return new Promise<void>(async (resolve) => {
        this.$state = { ...defaultState }
        window.sessionStorage.clear()
        window.localStorage.clear()
        await resetRouter().then()
        resolve()
      })
    },
  },
  getters: {
    isAdmin: (state) => state.roles.includes('system_admin_super'),
    hasToken: (state) => !!state.token && state.token.access_token,
    hasRoles: (state) => state.roles && state.roles.length > 0,
    getToken: (state) => state.token?.access_token,
    getUserId: (state) => state.userId,
    getUserName: (state) => state.userName,
  },
  persist: pInIaPersistConfig('user'),
})
