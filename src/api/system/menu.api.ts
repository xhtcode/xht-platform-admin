import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysMenuOperationRequest,
  SysMenuQueryRequest,
  SysMenuResponse,
  SysMenuTreeResponse
} from '@/model/system/menu.model'
import type { ModeIdType } from '@/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/menu/add',
  UPDATE = '/sys/menu/update',
  DELETE = '/sys/menu/delete/',
  QUERY_ONE = '/sys/menu/get/',
  QUERY_TREE = '/sys/menu/tree',
}

/**
 * 保存
 */
export const saveSysMenu = (data: SysMenuOperationRequest): AxiosPromise<boolean> => {
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
export const updateSysMenu = (data: SysMenuOperationRequest): AxiosPromise<boolean> => {
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
export const removeSysMenuById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个
 */
export const querySysMenuById = (id: ModeIdType): AxiosPromise<SysMenuResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
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
