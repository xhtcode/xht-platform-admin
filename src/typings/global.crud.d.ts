/**
 * 增删改查 基础字段设置
 */
declare global {
  /**
   * 公共modelId类型
   */
  export type ModeIdType = string | number | any

  /**
   * 公共modelId数组类型
   */
  export type ModeIdArrayType = ModeIdType[]

  /**
   * 增删改查操作类型
   */
  type OperationType = 'save' | 'update' | 'remove' | 'query'

  /**
   * 列表页面 表单查询参数
   */
  export interface PageQueryRequest {
    size?: number //数量
    current?: number //页码
    ascName?: string //正序排序字段名称
    descName?: string //倒序排序字段名称
    quick?: boolean // 快速搜索
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
   * 公共的响应类型
   */
  export interface BasicResponse {
    [key: string]: any
  }

  /**
   * 公共的元数据响应类型
   */
  export interface MetaResponse extends BasicResponse {
    createTime?: string // 创建时间
    updateTime?: string // 修改时间
    createBy?: string // 创建人
    updateBy?: string // 修改人
  }
  /**
   * 定义树节点类型
   */
  export interface INodeResponse<T> extends BasicResponse {
    id: T
    name: string
    path: string
    parentId: T | null
    children?: INodeResponse<T>[]
  }
  /**
   * 分页参数
   */
  export interface PageResponse<T> extends BasicResponse {
    current: number // 当前页
    size: number // 每页显示条数
    pages: number // 总页数
    total: number // 总条目数
    records: T[] // 结果集
  }

  /**
   * 新增/编辑操作配置
   */
  interface AddUpdateOption<Req extends BasicFormRequest> {
    title: string // 弹窗标题
    visibleStatus: boolean // 弹窗可见状态
    operationStatus: 'create' | 'update' // 操作类型
    loadingStatus: boolean // 加载状态
    addUpdateForm: Req // 表单数据
    [key: string]: any // 允许扩展其他属性
  }

  /**
   * 表格查询分页状态
   */
  export interface TableQueryPageState<Req extends PageQueryRequest, Res extends BasicResponse> {
    loadingStatus: boolean // 加载状态
    singleStatus: boolean // 单个操作禁用状态
    multipleStatus: boolean // 多个操作禁用状态
    searchStatus?: boolean // 是否显示搜索区域
    total: number // 总条目数
    pages: number // 总页数
    queryParams: Req // 查询参数
    selectedRows: Res[] // 选中行数据
    tableList: Res[] // 表格数据列表
    [key: string]: any
  }

  /**
   * 表格查询树形状态
   */
  export interface TableQueryListState<Req extends PageQueryRequest, Res extends BasicResponse> {
    loadingStatus: boolean // 加载状态
    refreshTable: boolean // 刷新表格状态
    expandAllStatus: boolean // 展开所有状态
    searchStatus: boolean // 是否显示搜索区域
    queryParams: Req // 查询参数
    tableList: Res[] // 表格数据列表
    selectedRows?: Res[]
    singleStatus?: true // 单个禁用
    multipleStatus?: true // 多个禁用
    [key: string]: any
  }
}
export {}
