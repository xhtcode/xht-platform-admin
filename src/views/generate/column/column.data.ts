import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenColumnInfoOperationRequest } from '@/model/generate/column.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenColumnInfoOperationForm: GenColumnInfoOperationRequest = {
  id: null,
  tableId: null,
  columnName: '',
  dbDataType: '',
  columnComment: '',
  defaultValue: '',
  isRequired: 0,
  isPrimary: 0,
  extConfig: {
    formItem: '',
    formRequired: '',
    formType: '',
    formValidator: '',
    gridItem: '',
    gridSort: '',
    queryItem: '',
    queryType: '',
    queryFormType: '',
  },
  sortOrder: 0,
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenColumnInfoOperationRules: FormRules<GenColumnInfoOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenColumnInfoColumnOption: ColumnOption[] = []
