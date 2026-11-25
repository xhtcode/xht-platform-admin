import type { RoleTypeStatus } from '@/service/model/system/role-type.model'

/**
 * 角色分类状态枚举
 */
export const roleTypeStatusEnum: DictEnum<RoleTypeStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
    type: 'success',
  },
  DISABLE: {
    label: '停用',
    value: 1,
    type: 'danger',
  },
}
