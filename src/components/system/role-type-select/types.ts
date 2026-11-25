/**
 * 角色分类下拉组件 props 属性
 */
export interface RoleTypeSelectProps {
  placeholder?: string // 提示语
  disabled?: boolean // 是否禁用
  clearable?: boolean // 是否可清空
  fallbackLabel?: string // 当前值不在正常状态列表中的兜底显示名（如角色已绑定的类型被停用）
}
