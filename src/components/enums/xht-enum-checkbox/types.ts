/**
 * 枚举多选属性
 */
export interface XhtEnumCheckboxProps {
  data: DictEnum<any, any> // 枚举数据
  min?: number // 最小选择数量
  max?: number // 最大选择数量
  border?: boolean // 是否显示边框
  disabled?: boolean // 禁用选项
}

/**
 * 枚举多选emit
 */
export interface XhtEnumCheckboxEmits {
  (e: 'change', value: string[]): void
}
