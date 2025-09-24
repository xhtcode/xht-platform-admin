import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'
import {
  GenTableInfoOperationRequest,
  GenTableInfoQueryRequest,
  GenTableInfoResponse,
  ImportTableFormRequest,
} from '@/service/model/generate/table.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  IMPORT_TABLE = '/gen/table/info/import',
  UPDATE = '/gen/table/info/update',
  DELETE = '/gen/table/info/delete/',
  QUERY_ONE = '/gen/table/info/get/',
  QUERY_EXISTS_PAGE = '/gen/table/info/exists/page',
  QUERY_NO_EXISTS_PAGE = '/gen/table/info/no/exists/page',
  SYNC_TABLE = '/gen/table/info/syncTable/',
  DOWNLOAD_FILE = '/gen/code/generate',
}

/**
 * 保存表信息
 */
export const importTableInfo = (data: ImportTableFormRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.IMPORT_TABLE,
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
export const removeGenTableInfoByIds = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
    baseURL,
    method: 'post',
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
 * 分页查询已导入的表信息
 * @param data 查询参数
 */
export const queryExistsPage = (
  data?: GenTableInfoQueryRequest
): AxiosPromise<PageResponse<GenTableInfoResponse>> => {
  return request({
    url: Api.QUERY_EXISTS_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}

/**
 * 分页查询未导入的表信息
 * @param data 查询参数
 */
export const queryNoExistsPage = (
  data?: GenTableInfoQueryRequest
): AxiosPromise<GenTableInfoResponse[]> => {
  return request({
    url: Api.QUERY_NO_EXISTS_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}

/**
 * 同步表结构
 * @param tableId 表ID数组
 * @returns 同步结果的Promise
 */
export const syncTableApi = (tableId: ModeIdType[]) => {
  return request({
    url: Api.SYNC_TABLE + `${tableId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 下载文件
 * @param tableIds 表ID数组
 * @param packageName 包名
 * @returns 下载结果的Promise
 */
export const downloadFileApi = (
  tableIds: ModeIdType[],
  packageName: string
): AxiosPromise<Blob> => {
  return request({
    url: Api.DOWNLOAD_FILE,
    baseURL,
    method: 'post',
    data: { tableIds: tableIds, packageName: packageName },
  })
}
