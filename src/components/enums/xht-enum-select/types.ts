/**
 * 枚举选择框属性
 */
export interface XhtEnumSelectProps {
  data: DictEnum<any, any> // 枚举数据
  size?: '' | 'large' | 'default' | 'small' // 尺寸
  clearable?: boolean // 是否可以清空选项
  disabled?: boolean // 是否禁用
  placeholder?: string // 占位符
  multiple?: boolean // 是否多选
  multipleLimit?: number // 最多选择个数
  collapseTags?: boolean // 多选时是否折叠Tag
  collapseTagsTooltip?: boolean // 多选时Tag是否显示Tooltip
  maxCollapseTags?: number // 多选时最多显示多少Tag
}

/**
 * 枚举选择框emit
 */
export interface XhtEnumSelectEmits {
  (e: 'change', value?: string | string[]): void
  (e: 'remove-tag', value: string): void
}
