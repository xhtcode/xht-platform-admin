import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  UPLOAD_USER_AVATAR = '/user/upload/avatar',
  USER_PROFILE_INFO = '/user/profile/info',
  USER_PROFILE_ROUTER = '/user/profile/routers',
}

/**
 * 上传用户头像
 *
 * form-data 字段名固定为 `avatar`，成功返回头像值（写入 userAvatar 的内容）
 * @param file 头像文件
 */
export const uploadUserAvatar = (file: File): Promise<ApiResponse<string>> => {
  const data = new FormData()
  data.append('avatar', file)
  return request<string>({
    url: Api.UPLOAD_USER_AVATAR,
    baseURL,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/**
 * 获取当前登录用户信息
 */
export const getUserProfileInfo = (): Promise<ApiResponse<UserInfo>> => {
  return request<UserInfo>({
    url: Api.USER_PROFILE_INFO,
    baseURL,
    method: 'get',
  })
}

/**
 * 获取当前登录用户的动态路由（后端控制路由）
 */
export const getUserProfileRouters = (): Promise<ApiResponse<RouteRecordRaw[]>> => {
  return request<RouteRecordRaw[]>({
    url: Api.USER_PROFILE_ROUTER,
    baseURL,
    method: 'get',
  })
}
