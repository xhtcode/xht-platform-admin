import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysDictItemOperationRequest, SysDictItemQueryRequest, SysDictItemResponse } from '@/service/model/system/dict.item.model'
import { DictVo } from '@/store/modules/dict.store'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/dict/item/create',
  REMOVE = '/sys/dict/item/remove/',
  UPDATE = '/sys/dict/item/update/',
  QUERY_BY_ID = '/sys/dict/item/get/',
  QUERY_PAGE = '/sys/dict/item/page',
  QUERY_BY_DICT_CODE = '/sys/dict/item/code/',
}

/**
 * 保存字典项
 */
export const saveSysDictItem = (data: SysDictItemOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}
/**
 * 删除字典项
 * @param id 字典项ID
 */
export const removeSysDictItemById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + id,
    baseURL,
    method: 'post',
  })
}

/**
 * 修改字典项数据
 * @param data 字典项数据
 */
export const updateSysDictItem = (data: SysDictItemOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 查询单个字典项
 */
export const querySysDictItemById = (id: ModeIdType): Promise<ApiResponse<SysDictItemResponse>> => {
  return request<SysDictItemResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部字典项
 */
export const querySysDictItemPage = (data?: SysDictItemQueryRequest): Promise<ApiResponse<PageResponse<SysDictItemResponse>>> => {
  return request<PageResponse<SysDictItemResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: data,
  })
}

/**
 * 根据字典编码查询字典项
 * @param dictCode 字典编码
 */
export const queryByDictCode = (dictCode: string): Promise<ApiResponse<DictVo[]>> => {
  return request<DictVo[]>({
    url: Api.QUERY_BY_DICT_CODE + `${dictCode}`,
    baseURL,
    method: 'get',
  })
}
