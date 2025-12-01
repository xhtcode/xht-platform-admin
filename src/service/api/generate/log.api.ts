import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'
import type { GenLogQueryRequest, GenLogResponse } from '@/service/model/generate/log.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/log/create',
  UPDATE = '/gen/log/update',
  DELETE = '/gen/log/remove/',
  QUERY_ONE = '/gen/log/get/',
  QUERY_PAGE = '/gen/log/page',
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
export const queryGenLogPage = (data?: GenLogQueryRequest): AxiosPromise<PageResponse<GenLogResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
