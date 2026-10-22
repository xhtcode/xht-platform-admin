/**
 * 菜单树（多选）组件 props 属性
 */
export interface MenuTreeCheckProps {
  modelValue?: string[] // 选中的菜单id集合
  disabled?: boolean // 是否禁用
  showTopMenu?: boolean // 是否显示顶级菜单选项
  type?: 'ALL' | 'M' | 'C' | 'B' // 菜单类型过滤
}

/**
 * 菜单树（多选）组件 emit 类型
 */
export interface MenuTreeCheckEmits {
  (e: 'update:modelValue', value: string[]): void // 选中值变化
  (e: 'change', data?: any): void // 选中节点变化，回传选中的节点数据
}
