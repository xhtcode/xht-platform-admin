import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenColumnInfoOperationRequest } from '@/model/generate/column.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenColumnInfoOperationForm: GenColumnInfoOperationRequest = {
  id: null, //id
  tableId: null, //表ID
  columnName: '', //数据库字段名
  dbDataType: '', //数据库字段类型
  columnComment: '', //字段注释
  defaultValue: '', //字段默认值
  isRequired: 0, //是否必填
  isPrimary: 0, //是否主键
  extConfig: {
    formItem: '', //表单项
    formRequired: '', //表单必填
    formType: '', //表单类型
    formValidator: '', //表单效验
    gridItem: '', //列表项
    gridSort: '', //列表排序
    queryItem: '', //查询项
    queryType: '', //查询方式
    queryFormType: '', //查询表单类型
  },
  sortOrder: 0, //字段排序
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenColumnInfoOperationRules: FormRules<GenColumnInfoOperationRequest> = {
  // 数据库字段名验证
  columnName: [
    { required: true, message: '请输入数据库字段名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      message: '字段名只能包含字母、数字和下划线，且不能以数字开头',
      trigger: 'blur',
    },
    { min: 1, max: 64, message: '字段名长度限制在1-64个字符', trigger: 'blur' },
  ],

  // 数据库字段类型验证
  dbDataType: [
    { required: true, message: '请输入数据库字段类型', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z]+(\(\d+(,\s*\d+)?\))?$/,
      message: '请输入有效的数据类型（如varchar(255)、int等）',
      trigger: 'blur',
    },
  ],

  // 字段注释验证
  columnComment: [
    { required: true, message: '请输入字段注释', trigger: 'blur' },
    { max: 255, message: '注释长度不能超过255个字符', trigger: 'blur' },
  ],

  // 字段排序验证
  sortOrder: [
    { required: true, message: '请设置字段排序', trigger: 'blur' },
    { type: 'number', message: '排序必须为数字', trigger: 'blur' },
    { min: 0, message: '排序值不能为负数', trigger: 'blur' },
  ],

  // 表单项配置验证
  'extConfig.formItem': [{ type: 'boolean', message: '表单项必须为布尔值', trigger: 'change' }],

  // 表单必填配置验证
  'extConfig.formRequired': [
    { type: 'boolean', message: '表单必填必须为布尔值', trigger: 'change' },
  ],

  // 表单类型验证
  'extConfig.formType': [
    { required: true, message: '请选择表单类型', trigger: 'change' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '表单类型只能包含字母、数字和下划线',
      trigger: 'change',
    },
  ],

  // 列表项配置验证
  'extConfig.gridItem': [{ type: 'boolean', message: '列表项必须为布尔值', trigger: 'change' }],

  // 列表排序验证
  'extConfig.gridSort': [
    { type: 'number', message: '列表排序必须为数字', trigger: 'blur' },
    { min: 0, message: '列表排序不能为负数', trigger: 'blur' },
  ],

  // 查询项配置验证
  'extConfig.queryItem': [{ type: 'boolean', message: '查询项必须为布尔值', trigger: 'change' }],

  // 查询方式验证
  'extConfig.queryType': [
    {
      type: 'number',
      message: '请选择查询方式',
      trigger: 'change',
    },
    { pattern: /^[a-zA-Z_]+$/, message: '查询方式只能包含字母和下划线', trigger: 'change' },
  ],

  // 查询表单类型验证
  'extConfig.queryFormType': [
    {
      type: 'number',
      message: '请选择查询表单类型',
      trigger: 'change',
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '查询表单类型只能包含字母、数字和下划线',
      trigger: 'change',
    },
  ],
}

/**
 * 列表显示配置
 */
export const GenColumnInfoColumnOption: ColumnOption[] = []
