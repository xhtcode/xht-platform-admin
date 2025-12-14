import type { ColumnFormSelectOptionType } from '@/components/generate/column-form-select/types'

/**
 * 字典选项配置数组
 * 包含各种表单控件类型的选项，用于字典相关的表单元素
 */
const dictOptions: ColumnFormSelectOptionType[] = [
  { label: '字典Radio', value: 'dict-radio' },
  { label: '字典Select', value: 'dict-select' },
]

/**
 * 通用选项配置数组
 * 包含基于字典的表单控件类型选项
 */
const commonOptions: ColumnFormSelectOptionType[] = [
  { label: '输入框', value: 'input' },
  { label: '文本框', value: 'textarea' },
  { label: '数字框', value: 'number' },
  { label: '密码框', value: 'password' },
  { label: '下拉框', value: 'select' },
  { label: '单选按钮', value: 'radio' },
  { label: '多选框', value: 'checkbox' },
  { label: '日期控件', value: 'date' },
  { label: '图片上传', value: 'image' },
  { label: '文件上传', value: 'file' },
  { label: '富文本', value: 'upload' },
]

export { dictOptions, commonOptions }
