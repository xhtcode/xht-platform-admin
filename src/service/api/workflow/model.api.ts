import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { FlowModelOperationRequest, FlowModelQueryRequest, FlowModelResponse } from '@/service/model/workflow/model.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/act/re/model/create', // 新增流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
  UPDATE = '/act/re/model/update/', // 根据主键`id`更新流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
  REMOVE = '/act/re/model/remove/', // 根据主键`id`删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
  REMOVE_BATCH = '/act/re/model/remove/batch', // 根据主键`id`批量删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
  QUERY_BY_ID = '/act/re/model/get/', // 根据主键`id`查询流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
  QUERY_PAGE = '/act/re/model/page', // 分页查询流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
}

/**
 * 新增流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param form 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储表单请求参数
 */
export const saveFlowModel = (form: FlowModelOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param form 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储表单请求参数
 */
export const updateFlowModel = (form: FlowModelOperationRequest): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE + `${form.id}`,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param id 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储主键
 */
export const removeFlowModelById = (id: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`批量删除流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param ids 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储主键
 */
export const removeFlowModelByIdBatch = (ids: string[]): AxiosPromise<void> => {
  return request({
    url: Api.REMOVE_BATCH,
    baseURL,
    method: 'post',
    data: ids,
  })
}

/**
 * 根据主键`id`查询流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param id 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储主键
 */
export const queryFlowModelById = (id: ModeIdType): AxiosPromise<FlowModelResponse> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储
 *
 * @param query 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储查询请求参数
 */
export const queryFlowModelPage = (query?: FlowModelQueryRequest): AxiosPromise<PageResponse<FlowModelResponse>> => {
  return request({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
