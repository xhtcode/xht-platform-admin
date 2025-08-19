import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType } from '@/model/base.model'
import type {
  GenDataSourceOperationRequest,
  GenDataSourceQueryRequest,
  GenDataSourceResponse
} from '@/model/generate/datasource.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/datasource/add',
  UPDATE = '/gen/datasource/update',
  DELETE = '/gen/datasource/delete',
  QUERY_ONE = '/gen/datasource/get/',
  QUERY_LIST = '/gen/datasource/list',
  CONNECTION_TEST = '/gen/datasource/connection/',
}

/**
 * 保存数据源配置
 */
export const saveGenDataSource = (data: GenDataSourceOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改数据源配置数据
 */
export const updateGenDataSource = (data: GenDataSourceOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除数据源配置
 */
export const removeGenDataSourceByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个数据源配置
 */
export const queryGenDataSourceById = (id: ModeIdType): AxiosPromise<GenDataSourceResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部数据源配置
 */
export const queryGenDataSourceList = (
  data?: GenDataSourceQueryRequest,
): AxiosPromise<GenDataSourceResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}

/**
 * 查询单个数据源配置
 */
export const connectionTest = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.CONNECTION_TEST + `${id}`,
    baseURL,
    method: 'get',
  })
}
