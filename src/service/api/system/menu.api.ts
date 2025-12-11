import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysMenuOperationRequest, SysMenuQueryRequest, SysMenuResponse, SysMenuTreeResponse } from '@/service/model/system/menu.model'
import type { ModeIdType } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/menu/create',
  UPDATE = '/sys/menu/update',
  REMOVE = '/sys/menu/remove/',
  QUERY_BYID = '/sys/menu/get/',
  QUERY_TREE = '/sys/menu/tree',
}

/**
 * 保存菜单
 */
export const saveSysMenu = (data: SysMenuOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改菜单
 */
export const updateSysMenu = (data: SysMenuOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除菜单
 */
export const removeSysMenuById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询菜单
 */
export const querySysMenuById = (id: ModeIdType): AxiosPromise<SysMenuResponse> => {
  return request({
    url: Api.QUERY_BYID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询树形结构菜单
 */
export const querySysMenuTree = (data?: SysMenuQueryRequest): AxiosPromise<SysMenuTreeResponse> => {
  return request({
    url: Api.QUERY_TREE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
