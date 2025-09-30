import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysRoleOperationRequest,
  SysRoleQueryRequest,
  SysRoleResponse,
} from '@/service/model/system/role.model'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/role/add',
  UPDATE = '/sys/role/update',
  DELETE = '/sys/role/remove/',
  QUERY_ONE = '/sys/role/get/',
  QUERY_PAGE = '/sys/role/page',
  QUERY_MENU_ID = '/sys/role/menu/',
  BIND_MENU_ROLE = '/sys/role/menu/bind',
}

/**
 * 保存
 */
export const saveSysRole = (data: SysRoleOperationRequest): AxiosPromise<boolean> => {
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
export const updateSysRole = (data: SysRoleOperationRequest): AxiosPromise<boolean> => {
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
export const removeSysRoleById = (id: ModeIdType): AxiosPromise<boolean> => {
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
export const removeSysRoleByIds = (ids: string[]): AxiosPromise<boolean> => {
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
export const querySysRoleById = (id: ModeIdType): AxiosPromise<SysRoleResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部
 */
export const querySysRolePage = (
  data?: SysRoleQueryRequest
): AxiosPromise<PageResponse<SysRoleResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}

/**
 * 查询角色菜单
 * @param roleId 角色id
 */
export const selectMenuIdByRoleId = (roleId: any): AxiosPromise<any[]> => {
  return request({
    url: Api.QUERY_MENU_ID + roleId,
    baseURL,
    method: 'get',
  })
}
/**
 * 角色绑定菜单
 * @param data 角色绑定菜单数据
 */
export const roleMenuBind = (data: any): AxiosPromise<any[]> => {
  return request({
    url: Api.BIND_MENU_ROLE,
    baseURL,
    method: 'post',
    data: data,
  })
}
