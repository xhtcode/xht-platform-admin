import type { FormRules } from 'element-plus'
import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'
import type {
  GenTemplateGroupOperationRequest,
} from '@/service/model/generate/template.group.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTemplateOperationForm: GenTemplateOperationRequest = {
  groupId: undefined,
  id: undefined,
  templateContent: '',
  templateFileName: '',
  templateFilePath: '',
  templateFileType: '',
  templateIgnoreField: '',
  templateName: '',
  templateSort: 0,
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTemplateOperationRules: FormRules<GenTemplateOperationRequest> = {}

/**
 * 列表显示配置
 */
export const GenTemplateGroupOperationForm: GenTemplateGroupOperationRequest = {
  templateCount: 0,
  groupSort: 0,
  groupDesc: '',
  groupName: '',
  id: undefined,
}

/**
 * 模板分组rules配置
 */
export const GenTemplateGroupOperationRules: FormRules<GenTemplateGroupOperationRequest> = {
  groupName: [
    {
      required: true,
      message: '请输入分组名称',
      trigger: ['blur', 'change'],
    },
  ],
  groupSort: [
    {
      required: true,
      message: '请输入分组排序',
      trigger: ['blur', 'change'],
    },
  ],
  groupDesc: [
    {
      required: true,
      message: '请输入分组描述',
      trigger: ['blur', 'change'],
    },
  ],
  templateCount: [
    {
      required: true,
      message: '请输入模板数量',
      trigger: ['blur', 'change'],
    },
  ],
}
