import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysDictOperationRequest, SysDictQueryRequest, SysDictResponse } from '@/service/model/system/dict.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/dict/types/create',
  UPDATE = '/sys/dict/types/update/',
  REMOVE = '/sys/dict/types/remove/',
  QUERY_BY_ID = '/sys/dict/types/get/',
  QUERY_LIST = '/sys/dict/types/page',
}

/**
 * 保存字典
 */
export const saveSysDict = (data: SysDictOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改字典数据
 */
export const updateSysDict = (data: SysDictOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除字典
 * @param id 字典ID
 */
export const removeSysDictByIds = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + id,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个字典
 * @param id 字典ID
 */
export const querySysDictById = (id: ModeIdType): Promise<ApiResponse<SysDictResponse>> => {
  return request<SysDictResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部字典
 * @param data 查询参数
 */
export const querySysDictPage = (data?: SysDictQueryRequest): Promise<ApiResponse<PageResponse<SysDictResponse>>> => {
  return request<PageResponse<SysDictResponse>>({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'post',
    data: data,
  })
}
