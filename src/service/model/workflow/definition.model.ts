/**
 * 流程定义类型
 * category 分类 order 申请单据
 */
export type DefinitionType = 'category' | 'order'

/**
 * 流程定义状态
 */
export type DefinitionStatus = 0 | 1

/**
 * 流程扩展-流程定义查询请求参数类型
 */
export interface FlowDefinitionQueryRequest extends PageQueryRequest {
  /**
   * 父级ID（树形懒加载子节点查询）
   */
  parentId?: ModeIdType
  /**
   * 流程定义编码
   * */
  definitionCode?: string
  /**
   * 流程定义名称
   * */
  definitionName?: string
  /**
   * 流程定义状态：0禁用 1正常
   **/
  definitionStatus?: DefinitionStatus
}

/**
 * 流程扩展-流程定义响应类型
 */
export interface FlowDefinitionResponse extends MetaResponse {
  /**
   * 流程定义主键id
   * */
  id: ModeIdType
  /**
   * 流程定义父级ID
   */
  parentId: ModeIdType
  /**
   * 流程定义层级
   * */
  definitionLevel: number
  /**
   * 流程定义编码
   * */
  definitionCode: string
  /**
   * 流程定义名称
   * */
  definitionName: string
  /**
   * 流程定义类型：category分类 order申请单据
   * */
  definitionType: DefinitionType
  /**
   * 流程定义描述
   * */
  definitionDesc?: string
  /**
   * 流程定义状态：0禁用 1正常
   **/
  definitionStatus: DefinitionStatus
  /**
   * 流程定义排序号，数值越大越靠前
   * */
  definitionSort: number
}

/**
 * 流程扩展-流程定义响应类型树
 */
export interface FlowDefinitionTreeResponse extends FlowDefinitionResponse {
  /**
   * 是否存在子节点（树形懒加载展开箭头控制）
   */
  hasChildren?: boolean
  /**
   * 子节点（无限层级树形）
   **/
  children?: FlowDefinitionTreeResponse[]
}

/**
 * 流程扩展-流程定义表单请求参数类型
 */
export interface FlowDefinitionOperationRequest extends Partial<FlowDefinitionResponse>, BasicFormRequest {}
