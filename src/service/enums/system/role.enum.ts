import type { DataScope, RoleStatus } from '@/service/model/system/role.model'

/**
 * 角色状态枚举
 */
export const roleStatusEnum: DictEnum<RoleStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
    type: 'success',
  },
  DISABLE: {
    label: '禁用',
    value: 1,
    type: 'danger',
  },
}

/**
 * 数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限  5仅本人数据权限）
 */
export const roleDataScopeEnum: DictEnum<DataScope> = {
  ALL: {
    label: '全部数据权限',
    value: 1,
  },
  CUSTOM: {
    label: '自定数据权限',
    value: 2,
  },
  DEPT: {
    label: '本部门数据权限',
    value: 3,
  },
  DEPT_AND_CHILD: {
    label: '本部门及以下数据权限',
    value: 4,
  },
  SELF: {
    label: '仅本人数据权限',
    value: 5,
  },
}
