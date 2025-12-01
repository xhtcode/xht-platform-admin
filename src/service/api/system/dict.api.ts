import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysDictOperationRequest, SysDictQueryRequest, SysDictResponse } from '@/service/model/system/dict.model'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/dict/types/create',
  UPDATE = '/sys/dict/types/update',
  DELETE = '/sys/dict/types/remove',
  QUERY_ONE = '/sys/dict/types/get/',
  QUERY_LIST = '/sys/dict/types/page',
}

/**
 * 保存字典
 */
export const saveSysDict = (data: SysDictOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改字典数据
 */
export const updateSysDict = (data: SysDictOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除字典
 */
export const removeSysDictByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个字典
 */
export const querySysDictById = (id: ModeIdType): AxiosPromise<SysDictResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部字典
 */
export const querySysDictPage = (data?: SysDictQueryRequest): AxiosPromise<PageResponse<SysDictResponse>> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
