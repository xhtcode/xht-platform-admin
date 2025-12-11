import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType, PageResponse } from '@/service/model/base.model'
import type {
  GenTemplateGroupOperationRequest,
  GenTemplateGroupQueryRequest,
  GenTemplateGroupResponse,
} from '@/service/model/generate/template.group.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_GENERATE_API_PREFIX

enum Api {
  CREATE = '/gen/template/group/create',
  UPDATE = '/gen/template/group/update',
  REMOVE = '/gen/template/group/remove/',
  QUERY_BYID = '/gen/template/group/get/',
  QUERY_PAGE = '/gen/template/group/page',
  QUERY_LIST = '/gen/template/group/list',
}

/**
 * 保存模板信息
 */
export const saveGenTemplateGroup = (data: GenTemplateGroupOperationRequest): AxiosPromise<boolean> => {
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
export const updateGenTemplateGroup = (data: GenTemplateGroupOperationRequest): AxiosPromise<boolean> => {
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
export const removeGenTemplateGroupByIds = (id: ModeIdType): AxiosPromise<boolean> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 查询单个模板信息
 */
export const queryGenTemplateGroupById = (id: ModeIdType): AxiosPromise<GenTemplateGroupResponse> => {
  return request({
    url: Api.QUERY_BYID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部模板信息
 */
export const queryGenTemplateGroupList = (): AxiosPromise<GenTemplateGroupResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询模板信息
 * @param data
 */
export const queryGenTemplateGroupPage = (data?: GenTemplateGroupQueryRequest): AxiosPromise<PageResponse<GenTemplateGroupResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
