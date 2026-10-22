import type { SysDeptResponse } from '@/service/model/system/dept.model'

/**
 * 部门树选择组件 props 属性
 */
export interface DeptTreeSelectProps {
  modelValue: ModeIdType // 选中的部门id
  placeholder?: string // 提示语
  disabled?: boolean // 是否禁用
  clearable?: boolean // 是否可清空
  showTopDept?: boolean // 是否显示顶级部门选项
}

/**
 * 部门树选择组件 emit 类型
 */
export interface DeptTreeSelectEmits {
  (e: 'update:modelValue', value: ModeIdType): void // 选中值变化
  (e: 'clickNode', data: SysDeptResponse): void // 点击节点
}
