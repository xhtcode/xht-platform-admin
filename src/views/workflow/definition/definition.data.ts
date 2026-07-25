import type { FlowDefinitionOperationRequest, FlowDefinitionResponse } from '@/service/model/workflow/definition.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 流程扩展-流程定义 增改页面 表单类型 默认值
 */
export const flowDefinitionOperationForm: FlowDefinitionOperationRequest = {}

/**
 * 流程扩展-流程定义 增改页面 表单类型 表单校验
 */
export const flowDefinitionOperationRules: FormRules<Required<FlowDefinitionOperationRequest>> = {
  categoryId: [{ required: true, message: '请输入类别id', trigger: ['blur', 'change'] }],
  modelId: [{ required: true, message: '请输入模型id', trigger: ['blur', 'change'] }],
  modelName: [{ required: true, message: '请输入模型名称', trigger: ['blur', 'change'] }],
  modelVersion: [{ required: true, message: '请输入模型版本', trigger: ['blur', 'change'] }],
  definitionStatus: [{ required: true, message: '请输入流程定义状态', trigger: ['blur', 'change'] }],
  definitionSort: [{ required: true, message: '请输入流程定义排序', trigger: ['blur', 'change'] }],
  definitionKey: [{ required: true, message: '请输入流程定义标识', trigger: ['blur', 'change'] }],
  definitionName: [{ required: true, message: '请输入流程定义名称', trigger: ['blur', 'change'] }],
  definitionDesc: [{ required: true, message: '请输入流程定义描述', trigger: ['blur', 'change'] }],
  deploymentId: [{ required: true, message: '请输入流程部署id', trigger: ['blur', 'change'] }],
  deploymentStatus: [{ required: true, message: '请输入流程部署状态', trigger: ['blur', 'change'] }],
  deploymentVersion: [{ required: true, message: '请输入流程部署版本', trigger: ['blur', 'change'] }],
  deploymentTime: [{ required: true, message: '请输入流程部署时间', trigger: ['blur', 'change'] }],
  formId: [{ required: true, message: '请输入表单id', trigger: ['blur', 'change'] }],
  formName: [{ required: true, message: '请输入表单名称', trigger: ['blur', 'change'] }],
}

/**
 * 流程扩展-流程定义 列表显示配置
 */
export const flowDefinitionColumnOption: ColumnConfig<FlowDefinitionResponse> = {
  modelName: { desc: '模型名称', visible: true, disabled: true },
  modelVersion: { desc: '模型版本', visible: false, disabled: false },
  definitionStatus: { desc: '流程定义状态', visible: false, disabled: false },
  definitionSort: { desc: '流程定义排序', visible: false, disabled: false },
  definitionKey: { desc: '流程定义标识', visible: true, disabled: false },
  definitionName: { desc: '流程定义名称', visible: true, disabled: true },
  definitionDesc: { desc: '流程定义描述', visible: true, disabled: true },
  deploymentStatus: { desc: '流程部署状态', visible: false, disabled: false },
  deploymentVersion: { desc: '流程部署版本', visible: false, disabled: false },
  deploymentTime: { desc: '流程部署时间', visible: true, disabled: true },
  formName: { desc: '表单名称', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
