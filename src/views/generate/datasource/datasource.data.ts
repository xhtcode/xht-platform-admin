import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { GenDataSourceOperationRequest, GenDataSourceResponse } from '@/service/model/generate/datasource.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 增改页面 表单类型 默认值
 */
export const genDataSourceOperationForm: Partial<GenDataSourceOperationRequest> = {
  name: '测试链接', // 默认空名称（需用户输入）
  dbType: DataBaseTypeEnums.MYSQL, // 默认MySQL（项目常用数据库类型）
  url: 'jdbc:mysql://localhost:3306/test', // 默认MySQL连接地址模板
  username: 'root', // 默认用户名（常见默认账号）
}

/**
 * 增改页面 表单类型 表单校验
 */
export const genDataSourceOperationRules: FormRules<Required<GenDataSourceOperationRequest>> = {
  dbType: [
    {
      required: true,
      message: '请选择数据库类型',
      trigger: ['blur', 'change'],
    },
  ],
  name: [
    {
      required: true,
      message: '请输入数据源名称',
      trigger: ['blur', 'change'],
    },
  ],
  url: [
    {
      required: true,
      message: '请输入数据库连接URL',
      trigger: ['blur', 'change'],
    },
  ],
  username: [
    {
      required: true,
      message: '请输入数据库用户名',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入数据库密码',
      trigger: ['blur', 'change'],
    },
  ],
}

/**
 * 列表显示配置
 */
export const genDataSourceColumnOption: ColumnConfig<GenDataSourceResponse> = {
  name: { desc: '数据库名称', visible: true, disabled: false },
  dbType: { desc: '数据库类型', visible: true, disabled: false },
  url: { desc: '数据库地址', visible: true, disabled: false },
  username: { desc: '数据库用户名', visible: true, disabled: false },
  lastTestTime: { desc: '最后测试时间', visible: true, disabled: false },
}
