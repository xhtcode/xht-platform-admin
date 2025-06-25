import type { CellStyle } from 'element-plus'
import type { AxiosPromise, AxiosResponse } from 'axios'
import { useMessage } from '@/hooks/use-message'
import {
  BasicResponse,
  EditUpdateRequest,
  PageQueryRequest,
  PageResponse,
} from '@/model/base.model'
import type { Reactive } from 'vue'

/**
 * 表格样式。
 */
export interface TableStyle {
  cellStyle: CellStyle<any>
  headerCellStyle: CellStyle<any>
}

export interface TableQueryPageState<req extends PageQueryRequest, Response extends BasicResponse> {
  queryParams: req // 查询参数
  total: number // 	总条目数
  pages: number // 总页数
  searchStatus?: boolean // 是否显示搜索
  tableList: Response[] // 表格数据
  selectedRows: any[] // 选中行数据
  loadingStatus: boolean // 加载状态
  singleStatus: boolean // 单个禁用
  multipleStatus: boolean // 多个禁用
}

export const useTableQueryPageHooks = <
  Request extends PageQueryRequest,
  Response extends BasicResponse,
>(
  options: Reactive<TableQueryPageState<Request, Response>>,
  queryPageApi: (req: Request) => AxiosPromise<PageResponse<Response>>,
) => {
  const defaultOptions: TableQueryPageState<Request, Response> = {
    queryParams: {
      current: 1,
      size: 10,
    } as Request,
    singleStatus: true, // 单个禁用
    multipleStatus: true, // 多个禁用
    loadingStatus: false,
    total: 0,
    pages: 0,
    tableList: [],
    selectedRows: [],
  }
  const state = mergeDefaultOptions(defaultOptions, options)
  const { queryParams } = toRefs(state)
  /**
   * 查询数据列表
   */
  const handleQuery = async () => {
    state.loadingStatus = true
    await queryPageApi(queryParams.value)
      .then((response: AxiosResponse<PageResponse<Response>>) => {
        state.tableList = response.data.records || []
        state.total = response.data?.total || 0
        state.pages = response.data?.pages || 0
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }

  /**
   * 自定义表格索引生成
   */
  const createTableIndex = (index: number) => {
    return ((queryParams.value.current || 1) - 1) * (queryParams.value.size || 0) + index + 1
  }

  /**
   * 多选框选中数据
   * @param selection 选中信息
   */
  const handleSelectionChange = (selection: any[]) => {
    state.selectedRows = selection
    state.singleStatus = selection.length !== 1
    state.multipleStatus = !selection.length
  }

  return {
    createTableIndex,
    handleQuery,
    handleSelectionChange,
  }
}

/**
 * 合并默认属性配置和自定义属性配置
 * @param options 默认属性配置对象
 * @param props 自定义属性配置对象
 * @returns 合并后的属性配置对象
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
 * 表格工具栏样式
 */
export const useTableToolHooks = (): TableStyle => {
  return {
    cellStyle: { 'text-align': 'center' },
    headerCellStyle: {
      textAlign: 'center',
      background: 'var(--el-table-row-hover-bg-color)',
      color: 'var(--el-text-color-primary)',
      userSelect: 'none',
    },
  }
}

export interface AddUpdateOption<Request extends EditUpdateRequest> {
  title: string // 组件的标题
  visibleStatus: boolean // 控制组件是否可见的状态
  operationStatus: 'add' | 'update' //表示组件是否处于操作状态
  loadingStatus: boolean // 表示组件是否处于加载状态。`true`表示组件正在加载数据或资源，`false`表示加载已完成。
  addUpdateForm: Request

  [key: string]: any
}
