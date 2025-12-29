import type { DictVo } from '@/store/modules/dict.store'

/**
 * 字典标签显示属性
 */
export interface DictTagProps {
  dictCode: string // 字典类别编码
  filterLabel?: string | string[] // 字典项值
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
 * 字典标签显示事件
 */
export interface DictTagEmits {
  (e: 'tag-click', value: DictVo): void
}
