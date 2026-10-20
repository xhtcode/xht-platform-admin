import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysDeptOperationRequest, SysDeptQueryRequest, SysDeptTreeResponse } from '@/service/model/system/dept.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

enum Api {
  CREATE = '/sys/dept/create',
  UPDATE = '/sys/dept/update/',
  REMOVE = '/sys/dept/remove/',
  QUERY_BY_ID = '/sys/dept/get/',
  QUERY_TREE = '/sys/dept/tree',
}

/**
 * 保存
 */
export const saveSysDept = (data: SysDeptOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改数据
 */
export const updateSysDept = (data: SysDeptOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除
 */
export const removeSysDeptById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个
 */
export const querySysDeptById = (id: ModeIdType): Promise<ApiResponse<SysDeptOperationRequest>> => {
  return request<SysDeptOperationRequest>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部
 */
export const querySysDeptTree = (data?: SysDeptQueryRequest): Promise<ApiResponse<SysDeptTreeResponse[]>> => {
  return request<SysDeptTreeResponse[]>({
    url: Api.QUERY_TREE,
    baseURL,
    method: 'get',
    params: data,
  })
}
