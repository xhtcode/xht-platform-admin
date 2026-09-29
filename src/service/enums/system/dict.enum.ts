import { DictStatusType, ShowDisabledType } from '@/service/model/system/dict.model'

/**
 * 字典状态枚举
 */
export const sysDictStatusEnum: DictEnum<DictStatusType, 'ENABLED' | 'DISABLED'> = {
  ENABLED: {
    label: '正常',
    value: 1,
  },
  DISABLED: {
    label: '禁用',
    value: 0,
  },
}
/**
 * 子节点是否显示禁用状态
 */
export const sysShowDisabledEnum: DictEnum<ShowDisabledType, 'ENABLED' | 'DISABLED'> = {
  ENABLED: {
    label: '显示',
    value: 1,
  },
  DISABLED: {
    label: '不显示',
    value: 0,
  },
}
