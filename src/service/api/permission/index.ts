import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { RouteRecordRaw } from 'vue-router'

const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 后端控制路由，
 */
export const getRouters = (): AxiosPromise<RouteRecordRaw[]> => {
  return request({
    baseURL: baseURL,
    url: '/sys/user/profile/routers',
    method: 'get',
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): AxiosPromise<any> => {
  return request({
    url: '/sys/user/profile',
    baseURL: baseURL,
    method: 'get',
  })
}
