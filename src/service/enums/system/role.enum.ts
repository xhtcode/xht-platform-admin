import type { RoleStatus } from '@/service/model/system/role.model'

/**
 * 角色状态枚举
 */
export const roleStatusEnums: DictEnum<RoleStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    value: 1,
  },
}
