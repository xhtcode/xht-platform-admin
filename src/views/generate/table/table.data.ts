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
  // 分组ID验证
  groupId: [
    {
      required: true,
      message: '请选择分组',
      trigger: 'change',
    },
    {
      type: 'number',
      message: '分组ID必须为数字',
      trigger: 'change',
    },
  ],
  // 数据源ID验证
  dataSourceId: [
    {
      required: true,
      message: '请选择数据源',
      trigger: 'change',
    },
    {
      type: 'number',
      message: '数据源ID必须为数字',
      trigger: 'change',
    },
  ],

  // 引擎名称验证
  engineName: [
    {
      required: true,
      message: '请输入引擎名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 50,
      message: '引擎名称长度限制在1-50个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '引擎名称只能包含字母、数字和下划线',
      trigger: 'blur',
    },
  ],

  // 数据库表名验证
  tableName: [
    {
      required: true,
      message: '请输入数据库表名',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 64,
      message: '表名长度限制在1-64个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      message: '表名只能包含字母、数字和下划线，且不能以数字开头',
      trigger: 'blur',
    },
  ],

  // 表注释验证
  tableComment: [
    {
      required: true,
      message: '请输入表注释',
      trigger: 'blur',
    },
    {
      max: 255,
      message: '表注释长度不能超过255个字符',
      trigger: 'blur',
    },
  ],

  // 生成的类名验证
  codeName: [
    {
      required: true,
      message: '请输入生成的类名',
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

  // 代码的注释验证
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
