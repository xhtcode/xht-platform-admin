import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysUserOperationRequest,
  SysUserQueryRequest,
  SysUserResponse,
} from '@/service/model/system/user.model'
import type { ModeIdArrayType, ModeIdType, PageResponse } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/user/add',
  UPDATE = '/sys/user/update',
  DELETE = '/sys/user/delete/',
  QUERY_ONE = '/sys/user/get/',
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
    url: Api.SAVE,
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
    data: { ...data },
  })
}

/**
 * 删除
 */
export const removeSysUserById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
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
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个
 */
export const querySysUserById = (id: number): AxiosPromise<SysUserResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部
 */
export const querySysUserPage = (
  data?: SysUserQueryRequest
): AxiosPromise<PageResponse<SysUserResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
/**
 * 重置密码
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
export const UserRoleBind = (data: any): AxiosPromise<any[]> => {
  return request({
    url: Api.BIND_USER_ROLE,
    baseURL,
    method: 'post',
    data: data,
  })
}
