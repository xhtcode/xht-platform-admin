import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { RouteRecordRaw } from 'vue-router'

const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 后端控制路由，
 */
export const getRouters = (): Promise<ApiResponse<RouteRecordRaw[]>> => {
  return request<RouteRecordRaw[]>({
    baseURL: baseURL,
    url: '/sys/user/profile/routers',
    method: 'get',
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfoType>> => {
  return request<UserInfoType>({
    url: '/sys/user/profile',
    baseURL: baseURL,
    method: 'get',
  })
}
