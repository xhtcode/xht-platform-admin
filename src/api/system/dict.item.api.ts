import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  SysDictItemOperationRequest,
  SysDictItemQueryRequest,
  SysDictItemResponse,
} from '@/model/system/dict.item.model'
import type { ModeIdArrayType, ModeIdType, PageResponse } from '@/model/base.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  SAVE = '/sys/dict/item/add',
  DELETE = '/sys/dict/item/delete',
  UPDATE = '/sys/dict/item/update',
  QUERY_ONE = '/sys/dict/item/get/',
  QUERY_PAGE = '/sys/dict/item/page',
}

/**
 * 保存字典项
 */
export const saveSysDictItem = (data: SysDictItemOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}
/**
 * 删除字典项
 */
export const removeSysDictItemById = (id: ModeIdArrayType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: id,
  })
}
/**
 * 修改字典项数据
 */
export const updateSysDictItem = (data: SysDictItemOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 查询单个字典项
 */
export const querySysDictItemById = (id: ModeIdType): AxiosPromise<SysDictItemResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部字典项
 */
export const querySysDictItemPage = (
  data?: SysDictItemQueryRequest,
): AxiosPromise<PageResponse<SysDictItemResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
