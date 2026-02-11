import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysAreaOperationRequest, SysAreaQueryRequest, SysAreaResponse } from '@/service/model/area/area.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/area/create',
  UPDATE = '/sys/area/update',
  REMOVE = '/sys/area/remove/',
  REMOVE_BATCH = '/sys/area/remove',
  QUERY_BY_ID = '/sys/area/get/',
  QUERY_LIST = '/sys/area/list/',
}

/**
 * 创建系统管理-行政区划
 *
 * @param form 系统管理-行政区划表单请求参数
 */
export const saveSysArea = (form: SysAreaOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新系统管理-行政区划
 *
 * @param form 系统管理-行政区划表单请求参数
 */
export const updateSysArea = (form: SysAreaOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除系统管理-行政区划
 *
 * @param id 系统管理-行政区划主键
 */
export const removeSysAreaById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`删除系统管理-行政区划
 *
 * @param ids 系统管理-行政区划主键
 */
export const removeSysAreaByIdBatch = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询系统管理-行政区划
 *
 * @param id 系统管理-行政区划主键
 */
export const querySysAreaById = (id: ModeIdType): AxiosPromise<SysAreaResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 *  查询系统管理-行政区划
 *
 * @param query 系统管理-行政区划查询请求参数
 */
export const querySysAreaList = (query: SysAreaQueryRequest): AxiosPromise<INodeResponse<SysAreaResponse>[]> => {
  return request({
    url: Api.QUERY_LIST + `${query.parentId}`,
    baseURL,
    method: 'get',
  })
}
