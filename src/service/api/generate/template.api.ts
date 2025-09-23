import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType } from '@/service/model/base.model'
import type {
  GenTemplateOperationRequest,
  GenTemplateQueryRequest,
  GenTemplateResponse,
} from '@/service/model/generate/template.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/template/add',
  UPDATE = '/gen/template/update',
  DELETE = '/gen/template/delete',
  QUERY_ONE = '/gen/template/get/',
  QUERY_LIST = '/gen/template/list/',
}

/**
 * 保存模板信息
 */
export const saveGenTemplate = (data: GenTemplateOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改模板信息数据
 */
export const updateGenTemplate = (data: GenTemplateOperationRequest): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除模板信息
 */
export const removeGenTemplateById = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个模板信息
 */
export const queryGenTemplateById = (id: ModeIdType): AxiosPromise<GenTemplateResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
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
