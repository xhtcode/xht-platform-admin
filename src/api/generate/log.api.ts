import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/model/base.model'
import type {
  GenLogOperationRequest,
  GenLogQueryRequest,
  GenLogResponse,
} from '@/model/generate/log.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/log/add',
  UPDATE = '/gen/log/update',
  DELETE = '/gen/log/delete',
  QUERY_ONE = '/gen/log/get/',
  QUERY_PAGE = '/gen/log/page',
}

/**
 * 保存日志
 */
export const saveGenLog = (data: GenLogOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改日志数据
 */
export const updateGenLog = (data: GenLogOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除日志
 */
export const removeGenLogByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个日志
 */
export const queryGenLogById = (id: ModeIdType): AxiosPromise<GenLogResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部日志
 */
export const queryGenLogPage = (
  data?: GenLogQueryRequest,
): AxiosPromise<PageResponse<GenLogResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
