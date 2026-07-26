import type { DeptStatusType } from '@/service/model/system/dept.model'

/**
 * 部门状态枚举
 */
export const deptStatusEnum: DictEnum<DeptStatusType, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    value: 1,
  },
}
