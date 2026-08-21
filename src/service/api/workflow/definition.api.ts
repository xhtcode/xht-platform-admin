import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type {
  FlowDefinitionOperationRequest,
  FlowDefinitionQueryRequest,
  FlowDefinitionResponse,
  FlowDefinitionTreeResponse,
} from '@/service/model/workflow/definition.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_WORKFLOW_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/workflow/definition/create', // 新增流程扩展-流程定义
  UPDATE = '/workflow/definition/update', // 根据主键`id`更新流程扩展-流程定义
  REMOVE = '/workflow/definition/remove/', // 根据主键`id`删除流程扩展-流程定义
  QUERY_BY_ID = '/workflow/definition/get/', // 根据主键`id`查询流程扩展-流程定义
  QUERY_LIST = '/workflow/definition/list', // 查询流程扩展-流程定义集合
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
 * 查询流程扩展-流程定义集合
 *
 * @param query 流程扩展-流程定义查询请求参数
 */
export const queryFlowDefinitionList = (query?: FlowDefinitionQueryRequest): AxiosPromise<FlowDefinitionTreeResponse[]> => {
  return request({
    url: Api.QUERY_LIST,
    baseURL,
    method: 'get',
    params: query,
  })
}
