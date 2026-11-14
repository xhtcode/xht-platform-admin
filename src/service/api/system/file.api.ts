import request, { requestBlob, requestRaw } from '@/utils/request'
import type { ApiResponse, AxiosResponse } from 'axios'
import { BusinessError } from '@/utils/business-error'
import type {
  SysFileChunkMergeRequest,
  SysFileOperationRequest,
  SysFilePreviewInitRequest,
  SysFilePreviewInitResponse,
  SysFilePreviewStatusResponse,
  SysFileQueryRequest,
  SysFileResponse,
  TextPreviewChunk,
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
  PREVIEW_INIT = '/sys/files/preview/init',
  PREVIEW_STATUS = '/sys/files/preview/status',
  PREVIEW_CONTENT = '/sys/files/preview/content',
  PREVIEW_DOWNLOAD = '/sys/files/preview/download',
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
 * 初始化预览会话
 *
 * 打开预览前必须先调用：服务端在此完成文件存在性与访问权限校验（含用途策略），
 * 并下发 `previewId`、能力清单、转换状态、水印信息与访问地址。
 * `fileId` 与 `fileStorageKey` 二选一（优先 fileId）。
 *
 * @param form 预览初始化请求参数
 */
export const initSysFilePreview = (form: SysFilePreviewInitRequest): Promise<ApiResponse<SysFilePreviewInitResponse>> => {
  return request<SysFilePreviewInitResponse>({
    url: Api.PREVIEW_INIT,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 查询预览会话状态（转换轮询用）
 *
 * @param previewId 预览ID
 */
export const querySysFilePreviewStatus = (previewId: string): Promise<ApiResponse<SysFilePreviewStatusResponse>> => {
  return request<SysFilePreviewStatusResponse>({
    url: Api.PREVIEW_STATUS,
    baseURL,
    method: 'get',
    params: { previewId },
  })
}

/**
 * 失败响应（统一 R 结构）
 *
 * 预览内容接口成功时按 `previewMode` 直接返回裸数据（文本为 JSON、其它为二进制流），
 * 失败时仍以 HTTP 200 返回 R 结构。因此只能按响应体是否带 code 判定成败。
 */
interface PreviewFailureBody {
  code?: number
  msg?: string
}

/**
 * 分页读取文本预览内容
 *
 * 该接口没有统一业务信封，故走 `requestRaw`；又因失败体同样以 HTTP 200 返回，
 * 拦截器会按成功放行，这里必须自行识别并抛出，否则调用方会把错误体当成内容渲染。
 * 按项目约定 api 层不弹提示：错误文案随 `BusinessError.message` 交给调用方内联展示。
 *
 * @param previewId 预览ID
 * @param params 分页参数（续读时原样回传上一页的 offset）
 * @returns 文本分页数据
 */
export const querySysFileTextPreview = async (
  previewId: string,
  params: { offset?: number; pageNo?: number; size?: number; charset?: string; signal?: AbortSignal } = {}
): Promise<TextPreviewChunk> => {
  const { offset, pageNo, size, charset, signal } = params
  const body = await requestRaw<TextPreviewChunk & PreviewFailureBody>({
    url: Api.PREVIEW_CONTENT,
    baseURL,
    method: 'get',
    // 值为 undefined 的参数由 axios 自动丢弃，无需手工拼接查询串
    params: { previewId, offset, pageNo, size, charset },
    signal,
  })
  if (typeof body?.code === 'number') {
    throw new BusinessError(body.code, body.msg ?? '')
  }
  return body
}

/**
 * 拉取预览内容（二进制：image / pdf / video / audio / json）
 *
 * @param previewUrl 服务端下发的站内相对地址（`urls.previewUrl`，已含 previewId）
 */
export const fetchSysFilePreviewContent = (previewUrl: string): Promise<AxiosResponse<Blob>> => {
  return requestBlob({
    url: previewUrl,
    baseURL,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 * 下载预览文件（返回原始文件，非转换产物）
 *
 * @param previewId 预览ID
 */
export const downloadSysFilePreview = (previewId: string): Promise<AxiosResponse<Blob>> => {
  return requestBlob({
    url: Api.PREVIEW_DOWNLOAD,
    baseURL,
    method: 'get',
    params: { previewId },
    responseType: 'blob',
  })
}

/**
 * 拼接可直连访问的绝对地址
 *
 * 服务端下发的 `urls.*` 是站内相对路径（以 `/sys` 开头），
 * 而 `<img>` / `<video>` / `fetch` 等浏览器原生请求不走 axios 的 baseURL，需要自行补上网关前缀。
 *
 * @param url 相对服务根路径的地址（已是 http/https 时原样返回）
 */
export const toSysFileAbsoluteUrl = (url: string): string => {
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `${baseURL}${url}`
}
