import type { FlowDefinitionOperationRequest, FlowDefinitionResponse } from '@/service/model/workflow/definition.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { definitionStatusEnum } from '@/service/enums/workflow/definition.enum'

/**
 * 流程扩展-流程定义 增改页面 表单类型 默认值
 */
export const flowDefinitionOperationForm: FlowDefinitionOperationRequest = {
  definitionStatus: definitionStatusEnum.NORMAL.value,
  definitionSort: 999,
}

/**
 * 流程扩展-流程定义 增改页面 表单类型 表单校验
 */
export const flowDefinitionOperationRules: FormRules<Required<FlowDefinitionOperationRequest>> = {
  definitionCode: [{ required: true, message: '请输入流程定义编码', trigger: ['blur', 'change'] }],
  definitionName: [{ required: true, message: '请输入流程定义名称', trigger: ['blur', 'change'] }],
  definitionType: [{ required: true, message: '请选择流程定义类型', trigger: ['blur', 'change'] }],
  definitionStatus: [{ required: true, message: '请选择流程定义状态', trigger: ['blur', 'change'] }],
  definitionSort: [{ required: true, message: '请输入流程定义排序', trigger: ['blur', 'change'] }],
}

/**
 * 流程扩展-流程定义 列表显示配置
 */
export const flowDefinitionColumnOption: ColumnConfig<FlowDefinitionResponse> = {
  definitionType: { desc: '流程定义类型', visible: true, disabled: false },
  definitionName: { desc: '流程定义名称', visible: true, disabled: true },
  definitionCode: { desc: '流程定义编码', visible: true, disabled: true },
  definitionStatus: { desc: '流程定义状态', visible: true, disabled: false },
  definitionSort: { desc: '排序', visible: true, disabled: false },
  definitionDesc: { desc: '描述', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: true, disabled: true },
  createTime: { desc: '创建时间', visible: true, disabled: true },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
