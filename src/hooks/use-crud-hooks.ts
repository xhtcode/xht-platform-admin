import type { AxiosPromise, AxiosResponse } from 'axios'
import { BasicResponse, PageQueryRequest, PageResponse } from '@/model/base.model'
import type { Reactive, Ref } from 'vue'
import { toRef } from 'vue'

/**
 * 表格查询分页Hooks
 * @param options 响应式状态对象
 * @param queryPageApi 分页查询接口
 */
export const useTableQueryPageHooks = <Req extends PageQueryRequest, Res extends BasicResponse>(
  options: Reactive<TableQueryPageState<Req, Res>>,
  queryPageApi: (req: Req) => AxiosPromise<PageResponse<Res>>,
) => {
  // 默认配置
  const defaultOptions: TableQueryPageState<Req, Res> = {
    queryParams: {
      current: 1,
      size: 10,
    } as Req,
    singleStatus: true,
    multipleStatus: true,
    loadingStatus: false,
    total: 0,
    pages: 0,
    tableList: [],
    selectedRows: [],
  }

  // 合并默认配置与用户配置
  const state = mergeDefaultOptions(defaultOptions, options)
  const queryParams: Ref<Req> = toRef(state, 'queryParams')

  /**
   * 查询数据列表
   * @returns 数据查询Promise
   */
  const handleQuery = async (): Promise<void> => {
    state.loadingStatus = true
    try {
      const response: AxiosResponse<PageResponse<Res>> = await queryPageApi(queryParams.value)
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
   * 生成表格索引
   * @param index 当前页内行索引
   * @returns 全局索引值
   */
  const createTableIndex = (index: number): number => {
    const current = queryParams.value.current ?? 1
    const size = queryParams.value.size ?? 0
    return (current - 1) * size + index + 1
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

  return {
    createTableIndex,
    handleQuery,
    handleSelectionChange,
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

/**
 * 表格样式Hooks
 * @returns 统一的表格样式配置
 */
export const useTableToolHooks = (): TableStyle => {
  return {
    cellStyle: { textAlign: 'center' },
    headerCellStyle: {
      textAlign: 'center',
      background: 'var(--el-table-row-hover-bg-color)',
      color: 'var(--el-text-color-primary)',
      userSelect: 'none',
    },
  }
}
