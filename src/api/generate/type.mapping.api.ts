import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/model/base.model'
import type {
  GenTypeMappingOperationRequest,
  GenTypeMappingQueryRequest,
  GenTypeMappingResponse,
} from '@/model/generate/type.mapping.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/type/mapping/add',
  UPDATE = '/gen/type/mapping/update',
  DELETE = '/gen/type/mapping/delete',
  QUERY_ONE = '/gen/type/mapping/get/',
  QUERY_PAGE = '/gen/type/mapping/page',
  QUERY_LIST = '/gen/type/mapping/list',
}

/**
 * 保存字段映射
 */
export const saveGenTypeMapping = (data: GenTypeMappingOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改字段映射数据
 */
export const updateGenTypeMapping = (
  data: GenTypeMappingOperationRequest
): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除字段映射
 */
export const removeGenTypeMappingByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
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
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询字段映射
 */
export const queryGenTypeMappingPage = (
  data?: GenTypeMappingQueryRequest
): AxiosPromise<PageResponse<GenTypeMappingResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}

/**
 * 查询全部字段映射
 */
export const queryGenTypeMappingList = (
  data?: GenTypeMappingQueryRequest
): AxiosPromise<GenTypeMappingResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
