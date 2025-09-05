import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenTableInfoOperationRequest } from '@/model/generate/table.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTableInfoOperationForm: GenTableInfoOperationRequest = {
  codeComment: '',
  codeName: '',
  dataSourceId: undefined,
  engineName: '',
  groupId: null,
  id: null,
  tableComment: '',
  tableCreateTime: '',
  tableName: '',
  tableUpdateTime: '',
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTableInfoOperationRules: FormRules<GenTableInfoOperationRequest> = {
  // 代码名称验证
  codeName: [
    {
      required: true,
      message: '请输入代码名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: '类名长度限制在1-100个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[A-Z][a-zA-Z0-9]*$/,
      message: '类名必须以大写字母开头，可包含字母和数字',
      trigger: 'blur',
    },
  ],

  // 代码注释验证
  codeComment: [
    {
      required: true,
      message: '请输入代码注释',
      trigger: 'blur',
    },
    {
      max: 500,
      message: '代码注释长度不能超过500个字符',
      trigger: 'blur',
    },
  ],

  // 创建时间验证（通常为只读，做格式验证）
  tableCreateTime: [
    {
      pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$|^$/,
      message: '创建时间格式不正确（正确格式：yyyy-MM-dd HH:mm:ss）',
      trigger: 'blur',
    },
  ],

  // 更新时间验证（通常为只读，做格式验证）
  tableUpdateTime: [
    {
      pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$|^$/,
      message: '更新时间格式不正确（正确格式：yyyy-MM-dd HH:mm:ss）',
      trigger: 'blur',
    },
  ],
}

/**
 * 列表显示配置
 */
export const GenTableInfoColumnOption: ColumnOption[] = []
