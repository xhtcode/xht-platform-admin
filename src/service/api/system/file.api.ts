import request, { requestBlob } from '@/utils/request'
import type { ApiResponse, AxiosResponse } from 'axios'
import type {
  SysFileChunkMergeRequest,
  SysFileOperationRequest,
  SysFilePreviewResponse,
  SysFileQueryRequest,
  SysFileResponse,
} from '@/service/model/system/file.model'

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
  UPLOAD = '/sys/files/upload',
  CHUNK_PROGRESS = '/sys/files/chunk/progress/',
  CHUNK_UPLOAD = '/sys/files/chunk/upload',
  CHUNK_MERGE = '/sys/files/chunk/merge',
  DOWNLOAD = '/sys/files/download/',
  PREVIEW = '/sys/files/preview',
  PREVIEW_INIT = '/sys/files/preview/init',
}

/**
 * 根据主键`fileId`删除系统文件记录（逻辑删除，同步清理物理文件）
 *
 * @param fileId 文件ID
 */
export const removeSysFileById = (fileId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
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
export const querySysFileById = (fileId: ModeIdType): Promise<ApiResponse<SysFileResponse>> => {
  return request<SysFileResponse>({
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
export const querySysFilePage = (query?: SysFileQueryRequest): Promise<ApiResponse<PageResponse<SysFileResponse>>> => {
  return request<PageResponse<SysFileResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'post',
    data: query,
  })
}

/**
 * 上传文件（常规整文件上传，适用于小文件；大文件请使用分片上传）
 *
 * @param file 上传文件
 * @param form 文件上传请求参数
 */
export const uploadSysFile = (file: File, form?: SysFileOperationRequest): Promise<ApiResponse<SysFileResponse>> => {
  const data = new FormData()
  data.append('file', file)
  if (form?.fileUsed) {
    data.append('fileUsed', form.fileUsed)
  }
  return request<SysFileResponse>({
    url: Api.UPLOAD,
    baseURL,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/**
 * 查询分片上传进度（断点续传，返回已成功上传的分片序号列表）
 *
 * @param uploadId 分片上传标识
 */
export const querySysFileChunkProgress = (uploadId: string): Promise<ApiResponse<number[]>> => {
  return request<number[]>({
    url: Api.CHUNK_PROGRESS + `${uploadId}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分片上传（单分片，分片序号从0开始，重复上传直接覆盖）
 *
 * @param chunk 分片文件内容
 * @param uploadId 分片上传标识
 * @param chunkIndex 分片序号
 */
export const uploadSysFileChunk = (chunk: Blob, uploadId: string, chunkIndex: number): Promise<ApiResponse<void>> => {
  const data = new FormData()
  data.append('file', chunk)
  data.append('uploadId', uploadId)
  data.append('chunkIndex', `${chunkIndex}`)
  return request<void>({
    url: Api.CHUNK_UPLOAD,
    baseURL,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/**
 * 合并文件分片（校验分片完整性后按序号顺序合并，生成文件记录）
 *
 * @param form 分片合并请求参数
 */
export const mergeSysFileChunk = (form: SysFileChunkMergeRequest): Promise<ApiResponse<SysFileResponse>> => {
  const data = new FormData()
  data.append('uploadId', form.uploadId)
  data.append('fileName', form.fileName)
  data.append('chunkTotal', `${form.chunkTotal}`)
  if (form.fileUsed) {
    data.append('fileUsed', form.fileUsed)
  }
  if (form.fileDesc) {
    data.append('fileDesc', form.fileDesc)
  }
  if (form.fileHash) {
    data.append('fileHash', form.fileHash)
  }
  return request<SysFileResponse>({
    url: Api.CHUNK_MERGE,
    baseURL,
    method: 'post',
    data,
  })
}

/**
 * 下载文件
 *
 * @param fileStorageKey 文件存储key
 */
export const downloadSysFile = (fileStorageKey: string): Promise<AxiosResponse<Blob>> => {
  return requestBlob({
    url: Api.DOWNLOAD + `${fileStorageKey}`,
    baseURL,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 * 预览文件（支持 HTTP Range 分段请求；不支持的格式由后端返回错误）
 *
 * @param fileStorageKey 文件存储key
 */
export const previewSysFile = (fileStorageKey: string): Promise<AxiosResponse<Blob>> => {
  return requestBlob({
    url: Api.PREVIEW,
    baseURL,
    method: 'get',
    params: { fileStorageKey },
    responseType: 'blob',
  })
}

/**
 * 初始化预览信息
 *
 * 打开预览前调用：服务端在此完成文件存在性与访问权限校验，并返回文件基本信息与预览/下载地址。
 *
 * @param fileStorageKey 文件存储key
 */
export const initSysFilePreview = (fileStorageKey: string): Promise<ApiResponse<SysFilePreviewResponse>> => {
  return request<SysFilePreviewResponse>({
    url: Api.PREVIEW_INIT,
    baseURL,
    method: 'post',
    params: { fileStorageKey },
  })
}

/**
 * 拼接可直连访问的绝对地址
 *
 * 预览初始化返回的 `previewUrl` / `downloadUrl` 为相对服务根路径，需补上网关前缀。
 *
 * @param url 相对服务根路径的地址（已是 http/https 时原样返回）
 */
export const toSysFileAbsoluteUrl = (url: string): string => {
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `${baseURL}${url}`
}
