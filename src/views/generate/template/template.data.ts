import type { FormRules } from 'element-plus'
import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'
import type {
  GenTemplateGroupOperationRequest,
  GenTemplateGroupResponse,
} from '@/service/model/generate/template.group.model'
import { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTemplateOperationForm: GenTemplateOperationRequest = {
  groupId: undefined,
  id: undefined,
  templateContent: '',
  templateFileName: '',
  templateFilePath: '',
  templateFileType: 'txt',
  templateIgnoreField: [],
  templateName: '',
  templateSort: 999,
  isNew: false,
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTemplateOperationRules: FormRules<GenTemplateOperationRequest> = {
  templateName: [
    {
      required: true,
      message: '请输入模板名称',
      trigger: ['blur', 'change'],
    },
  ],
  templateContent: [
    {
      required: true,
      message: '请输入模板内容',
      trigger: ['blur', 'change'],
    },
  ],
  templateFilePath: [
    {
      required: true,
      message: '请输入文件路径模板',
      trigger: ['blur', 'change'],
    },
  ],
  templateFileName: [
    {
      required: true,
      message: '请输入文件名模板',
      trigger: ['blur', 'change'],
    },
  ],
  templateFileType: [
    {
      required: true,
      message: '请输入文件类型',
      trigger: ['blur', 'change'],
    },
  ],
  templateSort: [
    {
      required: true,
      message: '请输入模板排序',
      trigger: ['blur', 'change'],
    },
  ],
}

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

/**
 * 列表显示配置
 */
export const GenTemplateGroupOperationOption: ColumnConfig<GenTemplateGroupResponse> = {
  groupName: { desc: '分组名称', visible: true, disabled: false },
  templateCount: { desc: '模板数量', visible: true, disabled: false },
  groupSort: { desc: '分组描述', visible: true, disabled: false },
  groupDesc: { desc: '分组描述', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
