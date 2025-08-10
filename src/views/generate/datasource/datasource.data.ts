import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenDataSourceOperationRequest } from '@/model/generate/datasource.model'
import { DataBaseTypeEnums } from '@/model/generate/common.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenDataSourceOperationForm: GenDataSourceOperationRequest = {
  dbType: DataBaseTypeEnums.MYSQL,
  id: null,
  lastTestTime: '',
  name: '',
  testResult: '',
  url: '',
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenDataSourceOperationRules: FormRules<GenDataSourceOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenDataSourceColumnOption: ColumnOption[] = []
