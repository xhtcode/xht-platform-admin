import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type {
  GenTableInfoOperationRequest,
  GenTableInfoResponse,
} from '@/model/generate/table.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTableInfoOperationForm: GenTableInfoOperationRequest = {
  tableInfo: {} as GenTableInfoResponse,
  columnInfos: [],
  queryColumns: [],
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTableInfoOperationRules: FormRules<GenTableInfoOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenTableInfoColumnOption: ColumnOption[] = []
