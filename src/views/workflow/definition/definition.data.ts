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
export const flowDefinitionOperationRules: FormRules<Required<FlowDefinitionOperationRequest>> = {}

/**
 * 流程扩展-流程定义 列表显示配置
 */
export const flowDefinitionColumnOption: ColumnConfig<FlowDefinitionResponse> = {}
