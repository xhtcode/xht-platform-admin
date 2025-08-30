import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/model/base.model'
import type {
  GenTemplateOperationRequest,
  GenTemplateQueryRequest,
  GenTemplateResponse,
} from '@/model/generate/template.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  SAVE = '/gen/template/add',
  UPDATE = '/gen/template/update',
  DELETE = '/gen/template/delete',
  QUERY_ONE = '/gen/template/get/',
  QUERY_PAGE = '/gen/template/page',
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
export const removeGenTemplateByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
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
export const queryGenTemplatePage = (
  data?: GenTemplateQueryRequest
): AxiosPromise<PageResponse<GenTemplateResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
