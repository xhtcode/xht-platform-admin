import { IsCycleStatus, IsResetFlag } from '@/service/model/workflow/sequence.model'

/**
 * 是否循环 1:否 0:是
 */
export const IsCycleStatusEnum: DictEnum<IsCycleStatus, 'YES' | 'NO'> = {
  YES: {
    label: '是',
    value: 0,
  },
  NO: {
    label: '否',
    value: 1,
  },
}

/**
 * 重置周期 0:不重置1:每天 2:每月3:每年
 */
export const IsResetFlagEnum: DictEnum<IsResetFlag, 'RESET_NONE' | 'RESET_DAY' | 'RESET_MONTH' | 'RESET_YEAR'> = {
  RESET_NONE: {
    label: '不重置',
    value: 0,
  },
  RESET_DAY: {
    label: '每天',
    value: 1,
  },
  RESET_MONTH: {
    label: '每月',
    value: 2,
  },
  RESET_YEAR: {
    label: '每年',
    value: 3,
  },
}
