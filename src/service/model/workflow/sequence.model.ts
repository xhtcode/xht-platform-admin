/**
 * 流程扩展-流程序列号查询请求参数类型
 */
export interface FlowSequenceQueryRequest extends PageQueryRequest {
  sequenceCode?: string // 序列编码
  sequenceName?: string // 序列名称
  sequenceFormat?: string // 序列格式
  isCycle?: string // 是否循环
  resetFlag?: string // 重置周期
}

/**
 * 流程扩展-流程序列号响应类型
 */
export interface FlowSequenceResponse extends MetaResponse {
  id: ModeIdType // 序列id
  sequenceCode: string // 序列编码
  sequenceName: string // 序列名称
  sequenceFormat: string // 序列格式
  minValue: number // 最小值
  maxValue: number // 最大值
  currentValue: number // 当前值
  steppingValue: number // 步进值
  isCycle: string // 是否循环
  resetFlag: string // 重置周期
}

/**
 * 流程扩展-流程序列号表单请求参数类型
 */
export interface FlowSequenceOperationRequest extends Partial<FlowSequenceResponse>, BasicFormRequest {}
