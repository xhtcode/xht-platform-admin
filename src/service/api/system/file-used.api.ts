import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysFileUsedOperationRequest, SysFileUsedResponse } from '@/service/model/system/file-used.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  LIST = '/sys/files/used/list',
  LIST_ALL = '/sys/files/used/list-all',
  CREATE = '/sys/files/used/create',
  UPDATE = '/sys/files/used/update/',
  DISABLE = '/sys/files/used/disable/',
  REMOVE = '/sys/files/used/remove/',
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
 * 查询全部文件用途（含停用，管理员）
 */
export const querySysFileUsedListAll = (): Promise<ApiResponse<SysFileUsedResponse[]>> => {
  return request<SysFileUsedResponse[]>({
    url: Api.LIST_ALL,
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
 * 停用文件用途
 *
 * 有引用的用途不允许删除，只能停用（停用后不可再被选用于新上传）。
 *
 * @param id 用途ID
 */
export const disableSysFileUsed = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.DISABLE + `${id}`,
    baseURL,
    method: 'post',
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
