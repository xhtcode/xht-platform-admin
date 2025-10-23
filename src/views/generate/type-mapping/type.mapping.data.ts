import type { FormRules } from 'element-plus'
import { ColumnConfig, ColumnOption } from '@/components/table-tool-bar/types'
import type {
  GenTypeMappingOperationRequest,
  GenTypeMappingResponse,
} from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

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
  createBy: {
    desc: '创建人',
    visible: true,
    disabled: false,
  },
  createTime: {
    desc: '创建时间',
    visible: true,
    disabled: false,
  },
  updateBy: {
    desc: '更新人',
    visible: false,
    disabled: false,
  },
  updateTime: {
    desc: '更新时间',
    visible: false,
    disabled: false,
  },
}
