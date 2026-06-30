import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import {
  RoleSelectedMenuResponse,
  SysRoleMenuBindForm,
  SysRoleMenuBindVO,
  SysRoleOperationRequest,
  SysRoleQueryRequest,
  SysRoleResponse,
} from '@/service/model/system/role.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/role/create',
  UPDATE = '/sys/role/update',
  REMOVE = '/sys/role/remove/',
  QUERY_BY_ID = '/sys/role/get/',
  QUERY_PAGE = '/sys/role/page',
  QUERY_MENU_BY_ROLE_ID = '/sys/role/select/menu/',
  BIND_MENU_ROLE = '/sys/role/menu/bind',
  QUERY_ROLE_LIST = '/sys/user/role/',
}

/**
 * 保存角色
 */
export const saveSysRole = (data: SysRoleOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改角色
 *
 * @param data 角色
 */
export const updateSysRole = (data: SysRoleOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除角色
 */
export const removeSysRoleById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 批量删除角色
 * @param ids
 */
export const removeSysRoleByIds = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个角色
 */
export const querySysRoleById = (id: ModeIdType): AxiosPromise<SysRoleResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部角色
 */
export const querySysRolePage = (data?: SysRoleQueryRequest): AxiosPromise<PageResponse<SysRoleResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: data,
  })
}

/**
 * 查询角色菜单
 *
 * @param roleId 角色id
 */
export const selectMenuIdByRoleId = (roleId: ModeIdType): AxiosPromise<RoleSelectedMenuResponse> => {
  return request({
    url: Api.QUERY_MENU_BY_ROLE_ID + roleId,
    baseURL,
    method: 'get',
  })
}

/**
 * 角色绑定菜单
 * @param data 角色绑定菜单数据
 */
export const roleMenuBind = (data: SysRoleMenuBindForm): AxiosPromise<void> => {
  return request({
    url: Api.BIND_MENU_ROLE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 获取当前用户拥有的角色ID列表
 * @param userId 用户ID
 */
export const roleRoleByUserId = (userId: ModeIdType): AxiosPromise<SysRoleMenuBindVO> => {
  return request({
    url: Api.QUERY_ROLE_LIST + userId,
    baseURL,
    method: 'get',
  })
}
