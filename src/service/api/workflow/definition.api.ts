import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { FlowDefinitionOperationRequest, FlowDefinitionQueryRequest, FlowDefinitionResponse } from '@/service/model/workflow/definition.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_WORKFLOW_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/flow/definition/create', // 新增流程扩展-流程定义
  UPDATE = '/flow/definition/update', // 根据主键`id`更新流程扩展-流程定义
  REMOVE = '/flow/definition/remove/', // 根据主键`id`删除流程扩展-流程定义
  REMOVE_BATCH = '/flow/definition/remove/batch', // 根据主键`id`批量删除流程扩展-流程定义
  QUERY_BY_ID = '/flow/definition/get/', // 根据主键`id`查询流程扩展-流程定义
  QUERY_PAGE = '/flow/definition/page', // 分页查询流程扩展-流程定义
}

/**
 * 新增流程扩展-流程定义
 *
 * @param form 流程扩展-流程定义表单请求参数
 */
export const saveFlowDefinition = (form: FlowDefinitionOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新流程扩展-流程定义
 *
 * @param form 流程扩展-流程定义表单请求参数
 */
export const updateFlowDefinition = (form: FlowDefinitionOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除流程扩展-流程定义
 *
 * @param id 流程扩展-流程定义主键
 */
export const removeFlowDefinitionById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`批量删除流程扩展-流程定义
 *
 * @param ids 流程扩展-流程定义主键
 */
export const removeFlowDefinitionByIdBatch = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询流程扩展-流程定义
 *
 * @param id 流程扩展-流程定义主键
 */
export const queryFlowDefinitionById = (id: ModeIdType): AxiosPromise<FlowDefinitionResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询流程扩展-流程定义
 *
 * @param query 流程扩展-流程定义查询请求参数
 */
export const queryFlowDefinitionPage = (query?: FlowDefinitionQueryRequest): AxiosPromise<PageResponse<FlowDefinitionResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
