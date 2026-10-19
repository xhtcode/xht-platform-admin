import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { SysFileOperationRequest, SysFileQueryRequest, SysFileResponse } from '@/service/model/system/file.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  REMOVE = '/sys/files/remove/',
  QUERY_BY_ID = '/sys/files/get/',
  QUERY_PAGE = '/sys/files/page',
  UPLOAD = '/file/storage/upload',
  DOWNLOAD = '/file/storage/download/',
  PREVIEW = '/file/storage/preview/',
}

/**
 * 根据主键`fileId`删除系统文件记录（逻辑删除）
 *
 * @param fileId 文件ID
 */
export const removeSysFileById = (fileId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${fileId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`fileId`查询系统文件详情
 *
 * @param fileId 文件ID
 */
export const querySysFileById = (fileId: ModeIdType): AxiosPromise<SysFileResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${fileId}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询系统文件列表
 *
 * @param query 系统文件查询请求参数
 */
export const querySysFilePage = (query?: SysFileQueryRequest): AxiosPromise<PageResponse<SysFileResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}

/**
 * 上传文件
 *
 * @param file 上传文件
 * @param form 文件上传请求参数
 */
export const uploadSysFile = (file: File, form?: SysFileOperationRequest): AxiosPromise<SysFileResponse> => {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: Api.UPLOAD,
    baseURL,
    method: 'post',
    params: { fileUsed: form?.fileUsed || undefined },
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/**
 * 下载文件
 *
 * @param fileStorageKey 文件存储key
 */
export const downloadSysFile = (fileStorageKey: string): AxiosPromise<Blob> => {
  return request({
    url: Api.DOWNLOAD + `${fileStorageKey}`,
    baseURL,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 * 预览文件（浏览器可直接渲染的类型以 inline 方式返回，其余类型由后端降级为附件下载）
 *
 * @param fileStorageKey 文件存储key
 */
export const previewSysFile = (fileStorageKey: string): AxiosPromise<Blob> => {
  return request({
    url: Api.PREVIEW + `${fileStorageKey}`,
    baseURL,
    method: 'get',
    responseType: 'blob',
  })
}
