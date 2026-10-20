import type { ApiResponse } from 'axios'
import type { Reactive, Ref } from 'vue'
import { toRef } from 'vue'

/**
 * 表格查询分页Hooks
 * @param options 响应式状态对象
 * @param queryPageApi 分页查询接口
 * @param parseResponse 解析响应数据
 */
export const useTableQueryPageHooks = <Req extends PageQueryRequest, Res extends BasicResponse>(
  options: Reactive<TableQueryPageState<Req, Res>>,
  queryPageApi: (req?: Req) => Promise<ApiResponse<PageResponse<Res>>>,
  parseResponse?: (res: PageResponse<Res>) => void
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
   *
   * 失败提示由请求拦截器统一给出，此处不再向上抛错：
   * 现有调用方（分页、表单 success 回调、onMounted）均未 catch，抛错会变成未捕获拒绝。
   *
   * @returns 查询完成的 Promise
   */
  const handlePageQuery = async (): Promise<void> => {
    state.loadingStatus = true
    // 快速搜索 状态设置
    queryParams.value.quick = !state.searchStatus
    try {
      const response: ApiResponse<PageResponse<Res>> = await queryPageApi(queryParams.value)
      const { records = [], total = 0, pages = 0, current, size } = response.data
      state.tableList = records
      state.total = total
      state.pages = pages
      queryParams.value.current = current
      queryParams.value.size = size
      if (parseResponse) {
        parseResponse(response.data)
      }
    } catch (error) {
      // 保留上一次查询结果，便于用户直接重试
      console.error('数据查询失败:', error)
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
   * 处理当前行变化（单选表格）
   *
   * 单选场景下选中行应整体替换，避免多次点击后 selectedRows 只增不减，
   * 导致工具栏始终取到第一次选中的行。
   *
   * @param selection 当前选中的行，取消选中时为 null
   */
  const handleCurrentChange = (selection: Res | null): void => {
    state.selectedRows = selection ? [selection] : []
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
  queryPageApi: (req: Req) => Promise<ApiResponse<Res[]>>
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

  /**
   * 查询数据列表
   *
   * 与分页查询保持一致：失败提示由请求拦截器统一给出，此处不向上抛错，
   * 避免调用方未 catch 时产生未捕获拒绝。
   *
   * @returns 查询完成的 Promise
   */
  const handleListQuery = async (): Promise<void> => {
    state.loadingStatus = true
    queryParams.value.quick = !state.searchStatus
    try {
      const response: ApiResponse<Res[]> = await queryPageApi(queryParams.value)
      state.tableList = response.data
    } catch (error) {
      state.tableList = []
      console.error('列表查询失败:', error)
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
   * 处理当前行变化（单选表格）
   * @param selection 当前选中的行，取消选中时为 null
   */
  const handleCurrentChange = (selection: Res | null): void => {
    state.selectedRows = selection ? [selection] : []
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
