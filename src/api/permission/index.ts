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
    url: '/authority/user/profile/getRouters',
    method: 'get',
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): AxiosPromise<any> => {
  return request({
    url: '/authority/user/profile/info',
    baseURL: baseURL,
    method: 'get',
  })
}
