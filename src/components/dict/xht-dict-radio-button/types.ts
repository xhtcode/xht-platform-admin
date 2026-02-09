/**
 * 字典单选组件属性
 */
export interface XhtDictRadioButtonProps {
  dictCode: string // 字典类别编码
  border?: boolean // 是否显示边框
}

/**
 * 字典单选组件emit
 */
export interface XhtDictRadioButtonEmits {
  (e: 'change', value?: string): void
}
