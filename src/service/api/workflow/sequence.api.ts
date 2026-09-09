import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { FlowSequenceOperationRequest, FlowSequenceQueryRequest, FlowSequenceResponse } from '@/service/model/workflow/sequence.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_WORKFLOW_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/flow/sequence/create', // 新增流程扩展-流程序列号
  UPDATE = '/flow/sequence/update/', // 根据主键`id`更新流程扩展-流程序列号
  REMOVE = '/flow/sequence/remove/', // 根据主键`id`删除流程扩展-流程序列号
  REMOVE_BATCH = '/flow/sequence/remove/batch', // 根据主键`id`批量删除流程扩展-流程序列号
  QUERY_BY_ID = '/flow/sequence/get/', // 根据主键`id`查询流程扩展-流程序列号
  QUERY_PAGE = '/flow/sequence/page', // 分页查询流程扩展-流程序列号
}

/**
 * 新增流程扩展-流程序列号
 *
 * @param form 流程扩展-流程序列号表单请求参数
 */
export const saveFlowSequence = (form: FlowSequenceOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新流程扩展-流程序列号
 *
 * @param form 流程扩展-流程序列号表单请求参数
 */
export const updateFlowSequence = (form: FlowSequenceOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE + `${form.id}`,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除流程扩展-流程序列号
 *
 * @param id 流程扩展-流程序列号主键
 */
export const removeFlowSequenceById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`批量删除流程扩展-流程序列号
 *
 * @param ids 流程扩展-流程序列号主键
 */
export const removeFlowSequenceByIdBatch = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询流程扩展-流程序列号
 *
 * @param id 流程扩展-流程序列号主键
 */
export const queryFlowSequenceById = (id: ModeIdType): AxiosPromise<FlowSequenceResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询流程扩展-流程序列号
 *
 * @param query 流程扩展-流程序列号查询请求参数
 */
export const queryFlowSequencePage = (query?: FlowSequenceQueryRequest): AxiosPromise<PageResponse<FlowSequenceResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
