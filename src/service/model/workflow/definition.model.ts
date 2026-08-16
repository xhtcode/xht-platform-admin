/**
 * 流程扩展-流程定义查询请求参数类型
 */
export interface FlowDefinitionQueryRequest extends PageQueryRequest {}

/**
 * 流程扩展-流程定义响应类型
 */
export interface FlowDefinitionResponse extends MetaResponse {
  id: ModeIdType // 流程定义id
}

/**
 * 流程扩展-流程定义表单请求参数类型
 */
export interface FlowDefinitionOperationRequest extends Partial<FlowDefinitionResponse>, BasicFormRequest {}
