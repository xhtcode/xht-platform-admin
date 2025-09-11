import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type { GenTemplateOperationRequest } from '@/model/generate/template.model'
import type { GenTemplateGroupOperationRequest } from '@/model/generate/template.group.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTemplateOperationForm: GenTemplateOperationRequest = {
  content: '',
  fileNameTemplate: '',
  filePathTemplate: '',
  fileType: '',
  groupId: null,
  id: null,
  name: '',
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTemplateOperationRules: FormRules<GenTemplateOperationRequest> = {
  // 分组ID验证
  groupId: [
    {
      required: true,
      message: '请选择模板分组',
      trigger: 'change',
    },
    {
      type: 'number',
      message: '分组ID必须为数字',
      trigger: 'change',
    },
  ],

  // 模板名称验证
  name: [
    {
      required: true,
      message: '请输入模板名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: '模板名称长度限制在1-100个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.-]+$/,
      message: '模板名称只能包含中文、字母、数字、下划线、点和横杠',
      trigger: 'blur',
    },
  ],

  // 模板内容验证
  content: [
    {
      required: true,
      message: '请输入模板内容',
      trigger: 'blur',
    },
    {
      min: 10,
      message: '模板内容不能少于10个字符',
      trigger: 'blur',
    },
  ],

  // 文件类型验证
  fileType: [
    {
      required: true,
      message: '请输入文件类型',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '文件类型只能包含字母、数字和下划线',
      trigger: 'blur',
    },
    {
      max: 50,
      message: '文件类型长度不能超过50个字符',
      trigger: 'blur',
    },
  ],

  // 文件路径模板验证
  filePathTemplate: [
    {
      required: true,
      message: '请输入文件路径模板',
      trigger: 'blur',
    },
    {
      pattern: /^[\/a-zA-Z0-9_\{\}]+$/,
      message: '文件路径只能包含字母、数字、下划线、斜杠和模板变量标识{}',
      trigger: 'blur',
    },
    {
      max: 500,
      message: '文件路径长度不能超过500个字符',
      trigger: 'blur',
    },
  ],

  // 文件名模板验证
  fileNameTemplate: [
    {
      required: true,
      message: '请输入文件名模板',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_\{\}\.]+$/,
      message: '文件名只能包含字母、数字、下划线、点和模板变量标识{}',
      trigger: 'blur',
    },
    {
      max: 200,
      message: '文件名长度不能超过200个字符',
      trigger: 'blur',
    },
  ],
}

/**
 * 列表显示配置
 */
export const GenTemplateColumnOption: ColumnOption[] = []
export const GenTemplateGroupOperationForm: GenTemplateGroupOperationRequest = {
  groupSort: 0,
  groupDesc: '',
  groupName: '',
  id: undefined,
}
export const GenTemplateGroupOperationRules: FormRules<GenTemplateGroupOperationRequest> = {}
