/**
 * 字典单选组件属性
 */
export interface DictRadioButtonProps {
  dictCode: string // 字典类别编码
  border?: boolean // 是否显示边框
}

/**
 * 字典单选组件emit
 */
export interface DictRadioButtonEmits {
  (e: 'change', value?: string): void
}
