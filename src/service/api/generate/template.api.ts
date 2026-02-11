import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { GenTemplateOperationRequest, GenTemplateResponse } from '@/service/model/generate/template.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  CREATE = '/gen/template/create',
  UPDATE = '/gen/template/update',
  REMOVE = '/gen/template/remove/',
  QUERY_BY_ID = '/gen/template/get/',
  QUERY_LIST = '/gen/template/list/',
}

/**
 * 保存模板信息
 */
export const saveGenTemplate = (data: GenTemplateOperationRequest): AxiosPromise<ModeIdType> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改模板信息数据
 */
export const updateGenTemplate = (data: GenTemplateOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 删除模板信息
 */
export const removeGenTemplateById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询全部模板信息
 */
export const queryGenTemplateList = (groupId: ModeIdType): AxiosPromise<GenTemplateResponse[]> => {
  return request({
    url: Api.QUERY_LIST + `${groupId}`,
    baseURL,
    method: 'get',
  })
}
