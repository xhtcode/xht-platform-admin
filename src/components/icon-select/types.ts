/**
 * 图标选择器组件的属性接口
 * 定义了图标选择器组件所需的各种属性配置
 */
export interface IconSelectProps {
  /**
   * 组件的绑定值，用于v-model双向绑定
   */
  modelValue: string | null | undefined
  /**
   * 组件标题
   */
  title?: string
  /**
   * 输入框占位文本
   */
  placeholder?: string
  /**
   * 是否可清空
   */
  clearable?: boolean
}

/**
 * 图标项选项接口
 * 定义了单个图标项的数据结构
 */
export interface IconItemOptions {
  /**
   * 图标类型
   */
  itemType: string
  /**
   * 图标名称
   */
  iconName: any
}
