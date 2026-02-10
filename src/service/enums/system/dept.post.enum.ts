import type { SysDeptPostStatusType } from '@/service/model/system/dept.post.model'

/**
 * 部门状态
 */
export const sysDeptPostStatusEnums: DictEnum<SysDeptPostStatusType, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    value: 1,
  },
}
