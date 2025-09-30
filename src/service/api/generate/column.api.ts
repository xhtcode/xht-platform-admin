import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'
import type {
  GenColumnInfoOperationRequest,
  GenColumnInfoQueryRequest,
  GenColumnInfoResponse,
} from '@/service/model/generate/column.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/column/info/add',
  UPDATE = '/gen/column/info/update',
  DELETE = '/gen/column/info/remove',
  QUERY_ONE = '/gen/column/info/get/',
  QUERY_PAGE = '/gen/column/info/page',
}

/**
 * 保存字段信息
 */
export const saveGenColumnInfo = (data: GenColumnInfoOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改字段信息数据
 */
export const updateGenColumnInfo = (data: GenColumnInfoOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除字段信息
 */
export const removeGenColumnInfoByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个字段信息
 */
export const queryGenColumnInfoById = (id: ModeIdType): AxiosPromise<GenColumnInfoResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部字段信息
 */
export const queryGenColumnInfoPage = (
  data?: GenColumnInfoQueryRequest
): AxiosPromise<PageResponse<GenColumnInfoResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
