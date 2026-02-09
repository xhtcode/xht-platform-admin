import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysOauth2ClientOperationRequest, SysOauth2ClientQueryRequest, SysOauth2ClientResponse } from '@/service/model/oauth2/client.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/oauth2/client/create',
  UPDATE = '/sys/oauth2/client/update',
  REMOVE = '/sys/oauth2/client/remove/',
  REMOVE_BATCH = '/sys/oauth2/client/remove',
  QUERY_BY_ID = '/sys/oauth2/client/get/',
  QUERY_PAGE = '/sys/oauth2/client/page',
}

/**
 * 创建系统管理-客户端管理
 *
 * @param form 系统管理-客户端管理表单请求参数
 */
export const saveSysOauth2Client = (form: SysOauth2ClientOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新系统管理-客户端管理
 *
 * @param form 系统管理-客户端管理表单请求参数
 */
export const updateSysOauth2Client = (form: SysOauth2ClientOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除系统管理-客户端管理
 *
 * @param id 系统管理-客户端管理主键
 */
export const removeSysOauth2ClientById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`删除系统管理-客户端管理
 *
 * @param ids 系统管理-客户端管理主键
 */
export const removeSysOauth2ClientByIdBatch = (ids: string[]): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询系统管理-客户端管理
 *
 * @param id 系统管理-客户端管理主键
 */
export const querySysOauth2ClientById = (id: ModeIdType): AxiosPromise<SysOauth2ClientResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询系统管理-客户端管理
 *
 * @param query 系统管理-客户端管理查询请求参数
 */
export const querySysOauth2ClientPage = (query?: SysOauth2ClientQueryRequest): AxiosPromise<PageResponse<SysOauth2ClientResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
