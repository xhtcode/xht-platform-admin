/**
 * 枚举标签显示属性
 */
export interface XhtEnumTagProps {
  data: DictEnum<any, any> // 枚举数据
  filterLabel?: string | string[] // 枚举项值
  hit?: boolean // 是否有边框描边
  size?: '' | 'large' | 'default' | 'small' // Tag 的尺寸
  effect?: 'dark' | 'light' | 'plain' // Tag 的主题
  round?: boolean //Tag 是否为圆形
  // 排列方式
  alignment?: 'center' | 'normal' | 'stretch' | 'anchor-center' | 'baseline' // 对齐的方式
  className?: string // 额外的类名
  direction?: 'horizontal' | 'vertical' // 排列的方向
  spaceSize?: '' | 'small' | 'default' | 'large' // 间隔大小
  wrap?: boolean // 设置是否自动折行
  fill?: boolean //	子元素是否填充父容器
  fillRatio?: number //	填充父容器的比例
}

/**
 * 枚举标签显示事件
 */
export interface XhtEnumTagEmits {
  (e: 'tag-click', value: DictEnumItem<any>): void
}
