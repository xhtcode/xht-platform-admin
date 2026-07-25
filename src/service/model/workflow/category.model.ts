/**
 * 流程扩展-流程分类查询请求参数类型
 */
export interface FlowCategoryQueryRequest extends PageQueryRequest {}

/**
 * 流程扩展-流程分类响应类型
 */
export interface FlowCategoryResponse extends MetaResponse {
  id: ModeIdType // 类别id
  categoryCode: string // 类别编码
  categoryName: string // 类别名称
  categoryDesc: string // 类别描述
  categoryStatus: number // 类别状态
  categorySort: number // 类别排序
}

/**
 * 流程扩展-流程分类表单请求参数类型
 */
export interface FlowCategoryOperationRequest extends Partial<FlowCategoryResponse>, BasicFormRequest {}
