import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { BLogQueryRequest, BLogResponse } from '@/service/model/monitor/blog.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  QUERY_PAGE = '/sys/log/page',
  QUERY_BY_ID = '/sys/log/get/',
}

/**
 * 分页查询系统日志
 *
 * @param data 系统日志分页查询参数
 */
export const queryBLogPage = (data?: BLogQueryRequest): Promise<ApiResponse<PageResponse<BLogResponse>>> => {
  return request<PageResponse<BLogResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 获取系统日志详情
 *
 * @param id 日志主键ID
 */
export const queryBLogById = (id: ModeIdType): Promise<ApiResponse<BLogResponse>> => {
  return request<BLogResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}
