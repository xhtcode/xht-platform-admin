/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储查询请求参数类型
 */
export interface FlowModelQueryRequest extends PageQueryRequest {
  id?: string //
  name?: string //
  key?: string //
  category?: string //
  createTimeStart?: string // 开始时间
  createTimeEnd?: string // 结束时间
  lastUpdateTimeStart?: string // 开始时间
  lastUpdateTimeEnd?: string // 结束时间
  deploymentId?: string //
  editorSourceValueId?: string //
  editorSourceExtraValueId?: string //
  tenantId?: string //
}

/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储响应类型
 */
export interface FlowModelResponse extends MetaResponse {
  id: ModeIdType //
  rev: number //
  name: string //
  key: string //
  category: string //
  lastUpdateTime: string //
  version: number //
  metaInfo: string //
  deploymentId: string //
  editorSourceValueId: string //
  editorSourceExtraValueId: string //
  tenantId: string //
}

/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储表单请求参数类型
 */
export interface FlowModelOperationRequest extends Partial<FlowModelResponse>, BasicFormRequest {}
