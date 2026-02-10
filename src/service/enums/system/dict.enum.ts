import type { DictStatusType } from '@/service/model/system/dict.model'

/**
 * 字典状态枚举
 */
export const sysDictStatusEnums: DictEnum<DictStatusType, 'ENABLED' | 'DISABLED'> = {
  ENABLED: {
    label: '正常',
    value: 1,
  },
  DISABLED: {
    label: '禁用',
    value: 2,
  },
}
