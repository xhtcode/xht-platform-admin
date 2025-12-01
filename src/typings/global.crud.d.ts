import { BasicFormRequest } from '@/service/model/base.model'

/**
 * 增删改查 基础字段设置
 */
declare global {
  /**
   * 增删改查操作类型
   */
  type OperationType = 'save' | 'update' | 'remove' | 'query'

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
   * 表格样式配置
   */
  export interface TableStyle {
    cellStyle: CellStyle<any>
    headerCellStyle: CellStyle<any>
  }

  /**
   * 表格查询分页状态
   */
  export interface TableQueryPageState<Req extends PageQueryRequest, Res extends BasicResponse> {
    queryParams: Req // 查询参数
    total: number // 总条目数
    pages: number // 总页数
    searchStatus?: boolean // 是否显示搜索区域
    tableList: Res[] // 表格数据列表
    selectedRows: Res[] // 选中行数据
    loadingStatus: boolean // 加载状态
    singleStatus: boolean // 单个操作禁用状态
    multipleStatus: boolean // 多个操作禁用状态
  }
}
export {}
