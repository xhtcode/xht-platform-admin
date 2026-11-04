import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysFileTypeOperationRequest, SysFileTypeQueryRequest, SysFileTypeResponse } from '@/service/model/system/file-type.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/files/type/create',
  UPDATE = '/sys/files/type/update/',
  REMOVE = '/sys/files/type/remove/',
  QUERY_BY_ID = '/sys/files/type/get/',
  QUERY_PAGE = '/sys/files/type/page',
}

/**
 * 新增文件预览类型配置
 *
 * @param data 预览类型配置表单
 */
export const saveSysFileType = (data: SysFileTypeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改文件预览类型配置（三个业务字段整体覆盖，不传后缀即清除后缀）
 *
 * @param data 预览类型配置表单（需携带 id）
 */
export const updateSysFileType = (data: SysFileTypeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 根据主键删除文件预览类型配置（逻辑删除）
 *
 * @param fileTypeId 配置ID
 */
export const removeSysFileTypeById = (fileTypeId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${fileTypeId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键查询文件预览类型配置详情
 *
 * @param fileTypeId 配置ID
 */
export const querySysFileTypeById = (fileTypeId: ModeIdType): Promise<ApiResponse<SysFileTypeResponse>> => {
  return request<SysFileTypeResponse>({
    url: Api.QUERY_BY_ID + `${fileTypeId}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询文件预览类型配置
 *
 * @param query 预览类型配置查询参数
 */
export const querySysFileTypePage = (query?: SysFileTypeQueryRequest): Promise<ApiResponse<PageResponse<SysFileTypeResponse>>> => {
  return request<PageResponse<SysFileTypeResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'post',
    data: query,
  })
}
