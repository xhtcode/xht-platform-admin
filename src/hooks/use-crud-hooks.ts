import type { AxiosPromise, AxiosResponse } from 'axios'
import type { Reactive, Ref } from 'vue'
import { toRef } from 'vue'

/**
 * 表格查询分页Hooks
 * @param options 响应式状态对象
 * @param queryPageApi 分页查询接口
 */
export const useTableQueryPageHooks = <Req extends PageQueryRequest, Res extends BasicResponse>(
  options: Reactive<TableQueryPageState<Req, Res>>,
  queryPageApi: (req: Req) => AxiosPromise<PageResponse<Res> | Res[]>
) => {
  // 默认配置
  const defaultOptions: TableQueryPageState<Req, Res> = {
    loadingStatus: false, // 加载状态
    singleStatus: true, // 单个操作禁用状态
    multipleStatus: true, // 多个操作禁用状态
    searchStatus: false, // 是否显示搜索区域
    total: 0, // 总条目数
    pages: 10, // 总页数
    queryParams: {} as Req, // 查询参数
    selectedRows: [], // 选中行数据
    tableList: [], // 表格数据列表
  }

  // 合并默认配置与用户配置
  const state = mergeDefaultOptions(defaultOptions, options)
  const queryParams: Ref<Req> = toRef(state, 'queryParams')

  /**
   * 查询数据列表
   * @returns 数据查询Promise
   */
  const handlePageQuery = async (): Promise<void> => {
    state.loadingStatus = true
    try {
      // 快速搜索 状态设置
      queryParams.value.quick = !state.searchStatus
      const response: AxiosResponse = await queryPageApi(queryParams.value)
      const { records = [], total = 0, pages = 0 } = response.data
      state.tableList = records
      state.total = total
      state.pages = pages
    } catch (err) {
      console.error('数据查询失败:', err)
      throw err // 抛出错误供外部处理
    } finally {
      state.loadingStatus = false
    }
  }

  /**
   * 处理选中行变化
   * @param selection 选中的行数据
   */
  const handleSelectionChange = (selection: Res[]): void => {
    state.selectedRows = selection
    state.singleStatus = selection.length !== 1
    state.multipleStatus = selection.length === 0
  }

  /**
   * 处理选中行变化
   * @param selection 选中的行数据
   */
  const handleCurrentChange = (selection: Res): void => {
    state.selectedRows.push(selection)
    state.singleStatus = !selection
    state.multipleStatus = !selection
  }
  return {
    handlePageQuery,
    handleSelectionChange,
    handleCurrentChange,
  }
}

/**
 * 表格查询分页Hooks
 * @param options 响应式状态对象
 * @param queryPageApi 分页查询接口
 */
export const useTableQueryListHooks = <Req extends PageQueryRequest, Res extends BasicResponse>(
  options: Reactive<TableQueryListState<Req, Res>>,
  queryPageApi: (req: Req) => AxiosPromise<Res[]>
) => {
  // 默认配置
  const defaultOptions: TableQueryListState<Req, Res> = {
    loadingStatus: false, // 加载状态
    refreshTable: true, // 刷新表格状态
    expandAllStatus: false, // 展开所有状态
    searchStatus: false, // 是否显示搜索区域
    queryParams: {} as Req, // 查询参数
    tableList: [], // 表格数据列表
  }
  // 合并默认配置与用户配置
  const state = mergeDefaultOptions(defaultOptions, options)
  const queryParams: Ref<Req> = toRef(state, 'queryParams')

  const handleListQuery = async (): Promise<void> => {
    state.loadingStatus = true
    try {
      // 快速搜索 状态设置
      queryParams.value.quick = !state.searchStatus
      const response: AxiosResponse = await queryPageApi(queryParams.value)
      state.tableList = response.data
    } catch (err) {
      throw err // 抛出错误供外部处理
    } finally {
      state.loadingStatus = false
    }
  }
  /**
   * 处理展开/折叠
   */
  const handleExpandAll = async () => {
    state.refreshTable = false
    state.expandAllStatus = !state.expandAllStatus
    await nextTick()
    state.refreshTable = true
  }

  /**
   * 处理选中行变化
   * @param selection 选中的行数据
   */
  const handleSelectionChange = (selection: Res[]): void => {
    state.selectedRows = selection
    state.singleStatus = selection.length !== 1
    state.multipleStatus = selection.length === 0
  }

  /**
   * 处理选中行变化
   * @param selection 选中的行数据
   */
  const handleCurrentChange = (selection: Res): void => {
    state.selectedRows.push(selection)
    state.singleStatus = !selection
    state.multipleStatus = !selection
  }
  return {
    handleListQuery,
    handleExpandAll,
    handleSelectionChange,
    handleCurrentChange,
  }
}

/**
 * 合并默认配置与自定义配置
 * @param options 默认配置
 * @param props 自定义配置
 * @returns 合并后的配置
 */
const mergeDefaultOptions = (options: any, props: any): TableQueryPageState<any, any> => {
  for (const key in options) {
    if (!Object.getOwnPropertyDescriptor(props, key)) {
      props[key] = options[key]
    }
  }
  return props
}
