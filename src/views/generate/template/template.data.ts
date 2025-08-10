import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenTemplateOperationRequest } from '@/model/generate/template.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTemplateOperationForm: GenTemplateOperationRequest = {
  content: '',
  fileNameTemplate: '',
  filePathTemplate: '',
  fileType: '',
  groupId: null,
  id: null,
  name: ''
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTemplateOperationRules: FormRules<GenTemplateOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenTemplateColumnOption: ColumnOption[] = []
