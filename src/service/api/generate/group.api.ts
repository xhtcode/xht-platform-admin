import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { ModeIdType } from '@/service/model/base.model'
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
  SAVE = '/gen/template/group/create',
  UPDATE = '/gen/template/group/update',
  DELETE = '/gen/template/group/remove/',
  QUERY_ONE = '/gen/template/group/get/',
  QUERY_LIST = '/gen/template/group/list',
}

/**
 * 保存模板分组
 */
export const saveGenTemplateGroup = (
  data: GenTemplateGroupOperationRequest
): AxiosPromise<boolean> => {
  return request({
    url: Api.SAVE,
    baseURL,
    method: 'post',
    data: data,
  })
}

/**
 * 修改模板分组数据
 */
export const updateGenTemplateGroup = (
  data: GenTemplateGroupOperationRequest
): AxiosPromise<boolean> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: { ...data },
  })
}

/**
 * 删除模板分组
 */
export const removeGenTemplateGroupByIds = (ids: ModeIdType[]): AxiosPromise<boolean> => {
  return request({
    url: Api.DELETE,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 查询单个模板分组
 */
export const queryGenTemplateGroupById = (
  id: ModeIdType
): AxiosPromise<GenTemplateGroupResponse> => {
  return request({
    url: Api.QUERY_ONE + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询全部模板分组
 */
export const queryGenTemplateGroupList = (
  data?: GenTemplateGroupQueryRequest
): AxiosPromise<GenTemplateGroupResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: { ...data },
  })
}
