/**
 * 菜单树选择组件 props 属性
 */
export interface MenuTreeSelectProps {
  id?: ModeIdType // 忽略的菜单id
  placeholder?: string // 提示语
  disabled?: boolean // 是否禁用
  clearable?: boolean // 是否可清空
  showTopMenu?: boolean // 是否显示顶级菜单
  multiple?: boolean // 是否多选
  type?: 'M' | 'C' // 菜单类型
}

/**
 * 菜单树选择组件 emit 类型
 */
export interface MenuTreeSelectEmits {
  (e: 'change', data?: any): void // 选中节点变化（单选为节点对象，多选为节点数组）
}
