import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { GenTypeMappingOperationRequest, GenTypeMappingQueryRequest, GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  CREATE = '/gen/type/mapping/create',
  UPDATE = '/gen/type/mapping/update',
  REMOVE = '/gen/type/mapping/remove/',
  QUERY_BY_ID = '/gen/type/mapping/get/',
  QUERY_PAGE = '/gen/type/mapping/page',
  QUERY_LIST = '/gen/type/mapping/list',
}

/**
 * 保存字段映射
 */
export const saveGenTypeMapping = (data: GenTypeMappingOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改字段映射数据
 */
export const updateGenTypeMapping = (data: GenTypeMappingOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除字段映射
 */
export const removeGenTypeMappingByIds = (ids: ModeIdType[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个字段映射
 */
export const queryGenTypeMappingById = (id: ModeIdType): AxiosPromise<GenTypeMappingResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询字段映射
 */
export const queryGenTypeMappingPage = (data?: GenTypeMappingQueryRequest): AxiosPromise<PageResponse<GenTypeMappingResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: data,
  })
}

/**
 * 查询全部字段映射
 */
export const queryGenTypeMappingList = (data?: GenTypeMappingQueryRequest): AxiosPromise<GenTypeMappingResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: data,
  })
}
