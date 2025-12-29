import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { GenTypeMappingOperationRequest, GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTypeMappingOperationForm: Partial<GenTypeMappingOperationRequest> = {
  dbType: DataBaseTypeEnums.MYSQL,
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
  javaType: [
    {
      required: true,
      message: '请选择java类型语言类型',
      trigger: ['blur', 'change'],
    },
  ],
  tsType: [
    {
      required: true,
      message: '请选择ts类型语言类型',
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
  javaType: { desc: 'Java类型', visible: true, disabled: false },
  importPackage: { desc: '导入包路径', visible: false, disabled: false },
  tsType: { desc: 'Ts类型', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}

/**
 * 数据库数据类型
 */
export const DbDataTypeList: any[] = [
  { value: 'bigint' },
  { value: 'binary' },
  { value: 'bit' },
  { value: 'blob' },
  { value: 'char' },
  { value: 'date' },
  { value: 'datetime' },
  { value: 'decimal' },
  { value: 'double' },
  { value: 'enum' },
  { value: 'float' },
  { value: 'int' },
  { value: 'json' },
  { value: 'longblob' },
  { value: 'longtext' },
  { value: 'mediumblob' },
  { value: 'mediumint' },
  { value: 'mediumtext' },
  { value: 'numeric' },
  { value: 'set' },
  { value: 'smallint' },
  { value: 'text' },
  { value: 'time' },
  { value: 'timestamp' },
  { value: 'tinyblob' },
  { value: 'tinyint' },
  { value: 'tinytext' },
  { value: 'varbinary' },
  { value: 'varchar' },
  { value: 'year' },
]
