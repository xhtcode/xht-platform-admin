import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import {
  SysUserOperationRequest,
  SysUserQueryRequest,
  SysUserResponse,
  SysUserVo,
  UserRoleBindOperationRequest,
} from '@/service/model/system/user.model'
import type { ModeIdArrayType, ModeIdType, PageResponse } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/user/create',
  UPDATE = '/sys/user/update',
  REMOVE = '/sys/user/remove/',
  QUERY_BY_ID = '/sys/user/get/',
  QUERY_PAGE = '/sys/user/page',
  RESET_PASSWORD = `/sys/user/reset/`,
  QUERY_ROLE_ID = '/sys/user/role/',
  BIND_USER_ROLE = '/sys/user/role/bind',
}

/**
 * 保存
 */
export const saveSysUser = (data: SysUserOperationRequest): AxiosPromise<boolean> => {
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
export const updateSysUser = (data: SysUserOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除
 */
export const removeSysUserById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 批量删除
 * @param ids
 */
export const removeSysUserByIds = (ids: ModeIdArrayType): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE,
    baseURL,
    method: 'post',
    data: ids,
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
export const resetPassword = (userId: any): AxiosPromise<boolean> => {
  return request({
    url: Api.RESET_PASSWORD + `${userId}/pwd`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询用户拥有的角色
 * @param userId 用户id
 */
export const selectRoleIdByUserId = (userId: any): AxiosPromise<any[]> => {
  return request({
    url: Api.QUERY_ROLE_ID + userId,
    baseURL,
    method: 'get',
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
