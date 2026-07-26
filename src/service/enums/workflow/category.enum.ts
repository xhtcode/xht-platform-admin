import type { CategoryStatus } from '@/service/model/workflow/category.model'

/**
 * 定义菜单状态枚举类型
 */
export const categoryStatusEnum: DictEnum<CategoryStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    value: 1,
  },
}
