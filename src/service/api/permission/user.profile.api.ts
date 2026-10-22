import request from '@/utils/request'
import type { ApiResponse } from 'axios'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  QUERY_USER_PROFILE = '/sys/user/profile',
}

/**
 * 获取当前登录用户信息
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfoType>> => {
  return request<UserInfoType>({
    url: Api.QUERY_USER_PROFILE,
    baseURL,
    method: 'get',
  })
}
