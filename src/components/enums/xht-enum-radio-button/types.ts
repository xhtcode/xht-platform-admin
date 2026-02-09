/**
 * 枚举单选组件属性
 */
export interface XhtEnumRadioButtonProps {
  data: DictEnum<any, any> // 枚举数据
  border?: boolean // 是否显示边框
}

/**
 * 枚举单选组件emit
 */
export interface XhtEnumRadioButtonEmits {
  (e: 'change', value?: string): void
}
