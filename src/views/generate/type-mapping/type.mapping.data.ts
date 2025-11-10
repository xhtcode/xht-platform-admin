import type { FormRules } from 'element-plus'
import { ColumnConfig } from '@/components/table-tool-bar/types'
import type {
  GenTypeMappingOperationRequest,
  GenTypeMappingResponse,
} from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

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
export const GenTypeMappingColumnOption: ColumnConfig<GenTypeMappingResponse> = {
  dbType: { desc: '数据库类型', visible: true, disabled: false },
  dbDataType: { desc: '数据库数据类型', visible: true, disabled: false },
  targetLanguage: { desc: '目标编程语言', visible: true, disabled: false },
  targetDataType: { desc: '目标语言数据类型', visible: true, disabled: false },
  importPackage: { desc: '导入包路径', visible: true, disabled: false },
}
