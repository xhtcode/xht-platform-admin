import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type {
  SysFileUsedOperationRequest,
  SysFileUsedQueryRequest,
  SysFileUsedResponse,
  SysFileUsedTypeOperationRequest,
  SysFileUsedTypeResponse,
} from '@/service/model/system/file-used.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  LIST = '/sys/files/used/list',
  QUERY_PAGE = '/sys/files/used/page',
  QUERY_BY_ID = '/sys/files/used/get/',
  CREATE = '/sys/files/used/create',
  UPDATE = '/sys/files/used/update/',
  DISABLE = '/sys/files/used/disable/',
  REMOVE = '/sys/files/used/remove/',
  USED_TYPE = '/sys/files/used/type/',
}

/**
 * 查询启用中的文件用途（上传页下拉用，所有登录用户可调）
 */
export const querySysFileUsedList = (): Promise<ApiResponse<SysFileUsedResponse[]>> => {
  return request<SysFileUsedResponse[]>({
    url: Api.LIST,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询文件用途（含停用，管理员）
 *
 * @param query 用途分页查询参数（未传字段不参与过滤，按 sort、id 升序）
 */
export const querySysFileUsedPage = (query?: SysFileUsedQueryRequest): Promise<ApiResponse<PageResponse<SysFileUsedResponse>>> => {
  return request<PageResponse<SysFileUsedResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'post',
    data: query,
  })
}

/**
 * 根据ID查询文件用途详情（编辑回显用）
 *
 * @param id 用途ID
 */
export const querySysFileUsedById = (id: ModeIdType): Promise<ApiResponse<SysFileUsedResponse>> => {
  return request<SysFileUsedResponse>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 新增文件用途
 *
 * @param data 用途配置表单
 */
export const saveSysFileUsed = (data: SysFileUsedOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data,
  })
}

/**
 * 修改文件用途（`usedCode` 不可修改）
 *
 * @param id 用途ID
 * @param data 用途配置表单
 */
export const updateSysFileUsed = (id: ModeIdType, data: SysFileUsedOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${id}`,
    baseURL,
    method: 'post',
    data,
  })
}

/**
 * 删除文件用途（仅内置=0 且无引用时可删）
 *
 * @param id 用途ID
 */
export const removeSysFileUsed = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据文件使用id查询文件使用类型（授权弹窗回显用）
 *
 * 返回用途信息、文件全部类型列表及该用途已授权的文件类型ID列表
 *
 * @param usedId 用途ID
 */
export const querySysFileUsedTypeByUsedId = (usedId: ModeIdType): Promise<ApiResponse<SysFileUsedTypeResponse>> => {
  return request<SysFileUsedTypeResponse>({
    url: Api.USED_TYPE + `${usedId}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询用途已授权文件类型并覆盖式保存授权（body 为授权类型配置数组，空数组表示清空授权）
 *
 * @param id 用途ID
 * @param data 授权的文件类型配置列表（typeId + 单文件/分片大小配置）
 */
export const authorizeSysFileUsedType = (id: ModeIdType, data: SysFileUsedTypeOperationRequest[]): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.USED_TYPE + `${id}`,
    baseURL,
    method: 'post',
    data,
  })
}
