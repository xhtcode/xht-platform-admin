/**
 * 流程扩展-流程定义查询请求参数类型
 */
export interface FlowDefinitionQueryRequest extends PageQueryRequest {
  modelId?: string // 模型id
  modelName?: string // 模型名称
  definitionKey?: string // 流程定义标识
  definitionName?: string // 流程定义名称
  definitionDesc?: string // 流程定义描述
  deploymentId?: string // 流程部署id
  deploymentStatus?: string // 流程部署状态
  deploymentVersion?: string // 流程部署版本
  deploymentTimeStart?: string // 流程部署开始时间
  deploymentTimeEnd?: string // 流程部署结束时间
  formId?: string // 表单id
  formName?: string // 表单名称
}

/**
 * 流程扩展-流程定义响应类型
 */
export interface FlowDefinitionResponse extends MetaResponse {
  id: ModeIdType // 流程定义id
  categoryId: number // 类别id
  modelId: string // 模型id
  modelName: string // 模型名称
  modelVersion: number // 模型版本
  definitionStatus: number // 流程定义状态
  definitionSort: number // 流程定义排序
  definitionKey: string // 流程定义标识
  definitionName: string // 流程定义名称
  definitionDesc: string // 流程定义描述
  deploymentId: string // 流程部署id
  deploymentStatus: string // 流程部署状态
  deploymentVersion: string // 流程部署版本
  deploymentTime: string // 流程部署时间
  formId: string // 表单id
  formName: string // 表单名称
}

/**
 * 流程扩展-流程定义表单请求参数类型
 */
export interface FlowDefinitionOperationRequest extends Partial<FlowDefinitionResponse>, BasicFormRequest {}
