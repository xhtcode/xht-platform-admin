/**
 * 右边工作区props类型
 */
export interface RightToolbarPropsType {
  searchStatus?: boolean // 是否显示搜索框
  refreshStatus?: boolean // 是否显示刷新
  importStatus?: boolean // 是否导入
  exportStatus?: boolean // 是否导出
  columnStatus?: boolean // 显隐列
  gutter?: number // 列表项之间的间距
}

/**
 * state 类型
 */
export interface StateType {
  columnValue: string[] // 显隐数据
  openStatus: boolean // 是否显示弹出层
  loadingStatus: boolean // 加载
}

/**
 * 显隐数据类型
 */
export interface ColumnOption {
  desc: string //描述
  visible: boolean //是否显示 true 显示
  disabled?: boolean //是否禁用 true 禁用
}

/**
 * 部门操作请求相关字段的显隐配置类型
 * key 为 Response 的所有属性名，value 为对应字段的显隐配置
 */
export type ColumnConfig<Response extends BasicResponse> = {
  [key in keyof Response]?: ColumnOption
}

/**
 * emit 类型
 */
export interface EmitsType {
  (e: 'import'): void

  (e: 'export'): void

  (e: 'refresh'): void

  (e: 'column'): void
}
