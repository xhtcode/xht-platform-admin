import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/model/base.model'
import type {
  GenTableInfoOperationRequest,
  GenTableInfoQueryRequest,
  GenTableInfoResponse,
} from '@/model/generate/table.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/table/info/add',
  UPDATE = '/gen/table/info/update',
  DELETE = '/gen/table/info/delete',
  QUERY_ONE = '/gen/table/info/get/',
  QUERY_PAGE = '/gen/table/info/page',
}

/**
 * 保存表信息
 */
export const saveGenTableInfo = (data: GenTableInfoOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改表信息数据
 */
export const updateGenTableInfo = (data: GenTableInfoOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除表信息
 */
export const removeGenTableInfoByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个表信息
 */
export const queryGenTableInfoById = (id: ModeIdType): AxiosPromise<GenTableInfoResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部表信息
 */
export const queryGenTableInfoPage = (
  data?: GenTableInfoQueryRequest
): AxiosPromise<PageResponse<GenTableInfoResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
