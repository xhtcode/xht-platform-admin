import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenDataSourceOperationRequest } from '@/model/generate/datasource.model'
import { DataBaseTypeEnums } from '@/model/generate/common.model'

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
  // 数据库类型验证
  dbType: [
    {
      required: true,
      message: '请选择数据库类型',
      trigger: 'change',
    },
    {
      type: 'enum',
      enum: Object.values(DataBaseTypeEnums),
      message: '请选择有效的数据库类型',
      trigger: 'change',
    },
  ],

  // 数据源名称验证
  name: [
    {
      required: true,
      message: '请输入数据源名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: '数据源名称长度限制在1-100个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.-]+$/,
      message: '数据源名称只能包含中文、字母、数字、下划线、点和横杠',
      trigger: 'blur',
    },
  ],

  // 数据库连接URL验证
  url: [
    {
      required: true,
      message: '请输入数据库连接URL',
      trigger: 'blur',
    },
    {
      max: 500,
      message: '连接URL长度不能超过500个字符',
      trigger: 'blur',
    },
  ],

  // 最后测试时间（通常为只读，这里做宽松验证）
  lastTestTime: [
    {
      pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$|^$/,
      message: '时间格式不正确（正确格式：yyyy-MM-dd HH:mm:ss）',
      trigger: 'blur',
    },
  ],

  // 测试结果（通常为只读，这里做宽松验证）
  testResult: [
    {
      max: 200,
      message: '测试结果描述不能超过200个字符',
      trigger: 'blur',
    },
  ],
}

/**
 * 列表显示配置
 */
export const GenDataSourceColumnOption: ColumnOption[] = []
