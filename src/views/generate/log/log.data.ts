import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenLogOperationRequest } from '@/model/generate/log.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenLogOperationForm: GenLogOperationRequest = {
  batchNo: '',
  errorMsg: '',
  fileCount: 0,
  generateTime: '',
  id: null,
  projectId: null,
  status: '',
  tableIds: ''
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenLogOperationRules: FormRules<GenLogOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenLogColumnOption: ColumnOption[] = []
