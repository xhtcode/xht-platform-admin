import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysNoticeTypeOperationRequest, SysNoticeTypeQueryRequest, SysNoticeTypeResponse } from '@/service/model/system/notice.type.model'
import { LabelValue } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/notice/type/create', // 创建系统管理-通知类型
  UPDATE = '/sys/notice/type/update', // 根据主键`id`更新系统管理-通知类型
  REMOVE = '/sys/notice/type/remove/', // 根据主键`id`删除系统管理-通知类型
  REMOVE_BATCH = '/sys/notice/type/remove/batch', // 根据主键`id`批量删除系统管理-通知类型
  QUERY_BY_ID = '/sys/notice/type/get/', // 根据主键`id`查询系统管理-通知类型
  QUERY_LIST = '/sys/notice/type/list', // 查询全部系统管理-通知类型
  QUERY_ALL_LIST = '/sys/notice/type/enable/all', // 查询全部已启用的系统管理-通知类型
}

/**
 * 创建系统管理-通知类型
 *
 * @param form 系统管理-通知类型表单请求参数
 */
export const saveSysNoticeType = (form: SysNoticeTypeOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新系统管理-通知类型
 *
 * @param form 系统管理-通知类型表单请求参数
 */
export const updateSysNoticeType = (form: SysNoticeTypeOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除系统管理-通知类型
 *
 * @param id 系统管理-通知类型主键
 */
export const removeSysNoticeTypeById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`批量删除系统管理-通知类型
 *
 * @param ids 系统管理-通知类型主键
 */
export const removeSysNoticeTypeByIdBatch = (ids: string[]): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询系统管理-通知类型
 *
 * @param id 系统管理-通知类型主键
 */
export const querySysNoticeTypeById = (id: ModeIdType): AxiosPromise<SysNoticeTypeResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询系统管理-通知类型
 *
 * @param query 系统管理-通知类型查询请求参数
 */
export const querySysNoticeTypeList = (query?: SysNoticeTypeQueryRequest): AxiosPromise<SysNoticeTypeResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: query,
  })
}
/**
 * 分页查询系统管理-通知类型
 */
export const querySysNoticeEnableTypeList = (): AxiosPromise<LabelValue<ModeIdType, string>[]> => {
  return request({
    url: Api.QUERY_ALL_LIST,
    baseURL,
    method: 'get',
  })
}
