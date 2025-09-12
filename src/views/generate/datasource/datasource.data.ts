import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenDataSourceOperationRequest } from '@/service/model/generate/datasource.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 增改页面 表单类型 默认值
 */
export const GenDataSourceOperationForm: GenDataSourceOperationRequest = {
  id: null, // 默认无ID（适用于新增场景）
  name: '测试链接', // 默认空名称（需用户输入）
  dbType: DataBaseTypeEnums.MYSQL, // 默认MySQL（项目常用数据库类型）
  url: 'jdbc:mysql://localhost:3306/test', // 默认MySQL连接地址模板
  username: 'root', // 默认用户名（常见默认账号）
  password: '', // 默认空密码（需用户手动输入）
  testResult: '', // 默认无测试结果
  lastTestTime: '', // 默认无测试时间
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenDataSourceOperationRules: FormRules<GenDataSourceOperationRequest> = {
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
}

/**
 * 列表显示配置
 */
export const GenDataSourceColumnOption: ColumnOption[] = []
