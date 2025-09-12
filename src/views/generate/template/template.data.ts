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
      trigger : ['blur', 'change'],
    }
  ],

  // 模板名称验证
  name: [
    {
      required: true,
      message: '请输入模板名称',
      trigger : ['blur', 'change'],
    }
  ],

  // 模板内容验证
  content: [
    {
      required: true,
      message: '请输入模板内容',
      trigger : ['blur', 'change'],
    },
  ],

  // 文件类型验证
  fileType: [
    {
      required: true,
      message: '请输入文件类型',
      trigger : ['blur', 'change'],
    }
  ],

  // 文件路径模板验证
  filePathTemplate: [
    {
      required: true,
      message: '请输入文件路径模板',
      trigger : ['blur', 'change'],
    }
  ],

  // 文件名模板验证
  fileNameTemplate: [
    {
      required: true,
      message: '请输入文件名模板',
      trigger : ['blur', 'change'],
    }
  ],
}

/**
 * 列表显示配置
 */
export const GenTemplateGroupOperationForm: GenTemplateGroupOperationRequest = {
  groupSort: 0,
  groupDesc: '',
  groupName: '',
  id: undefined,
}
export const GenTemplateGroupOperationRules: FormRules<GenTemplateGroupOperationRequest> = {}
