/**
 * 枚举多选属性
 */
export interface XhtEnumCheckboxButtonProps {
  data: DictEnum<any, any> // 枚举数据
  min?: number // 最小选择数量
  max?: number // 最大选择数量
  border?: boolean // 是否显示边框
}

/**
 * 枚举多选emit
 */
export interface XhtEnumCheckboxButtonEmits {
  (e: 'change', value: string[]): void
}
