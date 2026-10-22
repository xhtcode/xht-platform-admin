import type { BLogExecuteStatus } from '@/service/model/monitor/blog.model'

/**
 * 系统日志执行状态枚举（与后端保持一致，ERROR 值经确认为 2）
 * OTHER(0, "其他") / NORMAL(1, "正常") / ERROR(2, "错误")
 */
export const bLogExecuteStatusEnum: DictEnum<BLogExecuteStatus, 'OTHER' | 'NORMAL' | 'ERROR'> = {
  OTHER: {
    label: '其他',
    value: 0,
    type: 'primary',
  },
  NORMAL: {
    label: '正常',
    value: 1,
    type: 'success',
  },
  ERROR: {
    label: '错误',
    value: 2,
    type: 'danger',
  },
}
