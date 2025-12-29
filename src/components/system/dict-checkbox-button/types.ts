/**
 * 字典多选属性
 */
export interface DictCheckboxButtonProps {
  dictCode: string // 字典类别编码
  min?: number // 最小选择数量
  max?: number // 最大选择数量
  border?: boolean // 是否显示边框
}

/**
 * 字典多选emit
 */
export interface DictCheckboxButtonEmits {
  (e: 'change', value: string[]): void
}
