/**
 * 列表页面 表单查询参数
 */
export interface PageQueryRequest {
  size?: number //数量
  current?: number //页码
  ascName?: string //正序排序字段名称
  descName?: string //倒序排序字段名称
  keyWord?: string //关键字
  [key: string]: any
}

/**
 * 列表页面 表单查询参数
 */
export interface BasicFormRequest {
  [key: string]: any
}

/**
 * 分页参数
 */
export interface PageResponse<T> {
  current: number // 当前页
  size: number // 每页显示条数
  pages: number // 总页数
  total: number // 总条目数
  records: T[] // 结果集
}

/**
 * 定义树节点类型
 */
export interface INodeResponse<T> {
  id: T
  name: string
  path: string
  parentId: T | null
  children?: INodeResponse<T>[]
  [key: string]: any
}

/**
 * 公共的响应类型
 */
export interface BasicResponse {
  createTime?: string // 创建时间
  updateTime?: string // 修改时间
  createBy?: string // 创建人
  updateBy?: string // 修改人
}

/**
 * 公共modelId类型
 */
export type ModeIdType = string | number | any
/**
 * 公共modelId数组类型
 */
export type ModeIdArrayType = ModeIdType[]

/**
 * 系统内置
 */
export enum SystemFlagEnums {
  /**
   * 系统内置
   */
  YES = 0,
  /**
   * 非系统内置
   */
  NO = 1,
}
