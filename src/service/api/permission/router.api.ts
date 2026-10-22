import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  QUERY_ROUTERS = '/sys/user/profile/routers',
}

/**
 * 获取当前登录用户的动态路由（后端控制路由）
 */
export const getRouters = (): Promise<ApiResponse<RouteRecordRaw[]>> => {
  return request<RouteRecordRaw[]>({
    url: Api.QUERY_ROUTERS,
    baseURL,
    method: 'get',
  })
}
