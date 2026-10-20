import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { GenDataSourceOperationRequest, GenDataSourceQueryRequest, GenDataSourceResponse } from '@/service/model/generate/datasource.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  CREATE = '/gen/datasource/create',
  UPDATE = '/gen/datasource/update/',
  REMOVE = '/gen/datasource/remove/',
  QUERY_BY_ID = '/gen/datasource/get/',
  QUERY_LIST = '/gen/datasource/list',
  CONNECTION_TEST = '/gen/datasource/connection/',
}

/**
 * 保存数据源配置
 */
export const saveGenDataSource = (data: GenDataSourceOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改数据源配置数据
 */
export const updateGenDataSource = (data: GenDataSourceOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除数据源配置
 */
export const removeGenDataSourceByIds = (ids: ModeIdType[]): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个数据源配置
 */
export const queryGenDataSourceById = (id: ModeIdType): Promise<ApiResponse<GenDataSourceResponse>> => {
  return request<GenDataSourceResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部数据源配置
 */
export const queryGenDataSourceList = (data?: GenDataSourceQueryRequest): Promise<ApiResponse<GenDataSourceResponse[]>> => {
  return request<GenDataSourceResponse[]>({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: data,
  })
}

/**
 * 查询单个数据源配置
 */
export const connectionTest = (id: ModeIdType): Promise<ApiResponse<boolean>> => {
  return request<boolean>({
    url: Api.CONNECTION_TEST + `${id}`,
    baseURL,
    method: 'get',
  })
}
