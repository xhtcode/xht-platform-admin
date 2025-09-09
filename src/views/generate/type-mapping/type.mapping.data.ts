import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenTypeMappingOperationRequest } from '@/model/generate/type.mapping.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/model/generate/common.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTypeMappingOperationForm: GenTypeMappingOperationRequest = {
  id: undefined,
  dbDataType: '',
  dbType: DataBaseTypeEnums.MYSQL,
  importPackage: '',
  targetDataType: '',
  targetLanguage: LanguageTypeEnums.JAVA,
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTypeMappingOperationRules: FormRules<GenTypeMappingOperationRequest> = {
  dbType: [
    {
      required: true,
      message: '请选择数据库类型',
      trigger: ['blur', 'change'],
    },
  ],
  dbDataType: [
    {
      required: true,
      message: '请输入数据库数据类型',
      trigger: ['blur', 'change'],
    },
  ],
  targetLanguage: [
    {
      required: true,
      message: '请选择目标编程语言',
      trigger: ['blur', 'change'],
    },
  ],
  targetDataType: [
    {
      required: true,
      message: '请输入目标语言数据类型',
      trigger: ['blur', 'change'],
    },
  ],
}

/**
 * 列表显示配置
 */
export const GenTypeMappingColumnOption: ColumnOption[] = []
