import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysUserOperationRequest,
  SysUserQueryRequest,
  SysUserResponse,
  SysUserVo,
  UpdatePwdFrom,
  UserRoleBindOperationRequest,
} from '@/service/model/system/user.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/user/create',
  UPDATE = '/sys/user/update/',
  REMOVE = '/sys/user/remove/',
  QUERY_BY_ID = '/sys/user/get/',
  QUERY_PAGE = '/sys/user/page',
  RESET_PASSWORD = `/sys/user/reset/`,
  UPDATE_PASSWORD = `/sys/user/update/pwd`,
  BIND_USER_ROLE = '/sys/user/role/bind',
}

/**
 * 保存
 */
export const saveSysUser = (data: SysUserOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改数据
 */
export const updateSysUser = (data: SysUserOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除
 */
export const removeSysUserById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个
 * @param id  id
 */
export const querySysUserById = (id: ModeIdType): AxiosPromise<SysUserVo> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部
 */
export const querySysUserPage = (data?: SysUserQueryRequest): AxiosPromise<PageResponse<SysUserResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: data,
  })
}

/**
 * 重置密码
 * @param userId 用户id
 */
export const resetPassword = (userId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.RESET_PASSWORD + `${userId}/pwd`,
    baseURL,
    method: 'post',
  })
}

/**
 * 修改密码
 * @param passWordInfo 密码信息
 */
export const updatePassword = (passWordInfo: UpdatePwdFrom): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_PASSWORD,
    baseURL,
    method: 'post',
    data: passWordInfo,
  })
}

/**
 * 用户绑定角色
 * @param data 用户角色绑定数据
 */
export const UserRoleBind = (data: UserRoleBindOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.BIND_USER_ROLE,
    baseURL,
    method: 'post',
    data: data,
  })
}
