import type { DefinitionType } from '@/service/model/workflow/definition.model'

/**
 * 流程定义树选择组件 props 属性
 */
export interface FlowDefinitionTreeSelectProps {
  excludeId?: ModeIdType // 忽略的流程定义id（修改时传入自身ID，防止选择自己为上级）
  placeholder?: string // 提示语
  disabled?: boolean // 是否禁用
  clearable?: boolean // 是否可清空
}
