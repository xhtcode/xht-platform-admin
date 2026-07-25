import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { FlowCategoryOperationRequest, FlowCategoryQueryRequest, FlowCategoryResponse } from '@/service/model/workflow/category.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_WORKFLOW_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/flow/category/create', // 新增流程扩展-流程分类
  UPDATE = '/flow/category/update', // 根据主键`id`更新流程扩展-流程分类
  REMOVE = '/flow/category/remove/', // 根据主键`id`删除流程扩展-流程分类
  REMOVE_BATCH = '/flow/category/remove/batch', // 根据主键`id`批量删除流程扩展-流程分类
  QUERY_BY_ID = '/flow/category/get/', // 根据主键`id`查询流程扩展-流程分类
  QUERY_PAGE = '/flow/category/page', // 分页查询流程扩展-流程分类
}

/**
 * 新增流程扩展-流程分类
 *
 * @param form 流程扩展-流程分类表单请求参数
 */
export const saveFlowCategory = (form: FlowCategoryOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新流程扩展-流程分类
 *
 * @param form 流程扩展-流程分类表单请求参数
 */
export const updateFlowCategory = (form: FlowCategoryOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除流程扩展-流程分类
 *
 * @param id 流程扩展-流程分类主键
 */
export const removeFlowCategoryById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`批量删除流程扩展-流程分类
 *
 * @param ids 流程扩展-流程分类主键
 */
export const removeFlowCategoryByIdBatch = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询流程扩展-流程分类
 *
 * @param id 流程扩展-流程分类主键
 */
export const queryFlowCategoryById = (id: ModeIdType): AxiosPromise<FlowCategoryResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询流程扩展-流程分类
 *
 * @param query 流程扩展-流程分类查询请求参数
 */
export const queryFlowCategoryPage = (query?: FlowCategoryQueryRequest): AxiosPromise<PageResponse<FlowCategoryResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
