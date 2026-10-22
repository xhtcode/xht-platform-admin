import type { PaginationProps } from 'element-plus'

/**
 * 分页组件props属性
 */
export interface XhtPaginationProps extends Partial<PaginationProps> {
  class?: string
}

/**
 * 分页组件emit类型
 */
export interface XhtPaginationEmits {
  (e: 'pagination'): void
}
