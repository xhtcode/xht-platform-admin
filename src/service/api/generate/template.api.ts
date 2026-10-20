import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { GenTemplateOperationRequest, GenTemplateResponse } from '@/service/model/generate/template.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  CREATE = '/gen/template/create',
  UPDATE = '/gen/template/update/',
  REMOVE = '/gen/template/remove/',
  QUERY_BY_ID = '/gen/template/get/',
  QUERY_LIST = '/gen/template/list/',
}

/**
 * 保存模板信息
 */
export const saveGenTemplate = (data: GenTemplateOperationRequest): Promise<ApiResponse<ModeIdType>> => {
  return request<ModeIdType>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改模板信息数据
 */
export const updateGenTemplate = (data: GenTemplateOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${data.id}`,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除模板信息
 */
export const removeGenTemplateById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询全部模板信息
 */
export const queryGenTemplateList = (groupId: ModeIdType): Promise<ApiResponse<GenTemplateResponse[]>> => {
  return request<GenTemplateResponse[]>({
    url: Api.QUERY_LIST + `${groupId}`,
    baseURL,
    method: 'get',
  })
}
