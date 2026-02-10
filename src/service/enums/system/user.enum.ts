import type { UserStatusType, UserType } from '@/service/model/system/user.model'

/**
 * 用户类型枚举（对应 Java 的 UserTypeEnums）
 */
export const userTypeEnums: DictEnum<UserType, 'ADMIN' | 'BUSINESS' | 'USER'> = {
  ADMIN: {
    label: '管理员',
    value: 1,
    type: 'primary',
  },
  BUSINESS: {
    label: '商户',
    value: 2,
    type: 'success',
  },
  USER: {
    label: '用户',
    value: 3,
    type: 'info',
  },
}
/**
 * 用户状态枚举
 */
export const userStatusEnums: DictEnum<UserStatusType, 'NORMAL' | 'UNACTIVATED' | 'DISABLED' | 'LOCKED' | 'EXPIRED'> = {
  NORMAL: {
    label: '正常',
    value: 0,
    color: '#67C23A',
  },
  UNACTIVATED: {
    label: '未激活',
    value: 1,
    color: '#909399',
  },
  DISABLED: {
    label: '禁用',
    value: 2,
    color: '#F56C6C',
  },
  LOCKED: {
    label: '锁定',
    value: 3,
    color: '#E6A23C',
  },
  EXPIRED: {
    label: '过期',
    value: 4,
    color: '#F56C6C',
  },
}
