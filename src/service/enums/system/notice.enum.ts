/**
 * 跳转类型
 */
export const noticeJumpTypeEnums: DictEnum<number, 'NO_JUMP' | 'INNER_PAGE' | 'OUTER_LINK'> = {
  NO_JUMP: {
    label: '无跳转',
    value: 0,
  },
  INNER_PAGE: {
    label: '内部页面',
    value: 1,
  },
  OUTER_LINK: {
    label: '外部链接',
    value: 2,
  },
}

/**
 * 是否定时发布
 */
export const noticeTimedPublishEnums: DictEnum<number, 'NOT_PUBLISH' | 'PUBLISH'> = {
  NOT_PUBLISH: {
    label: '否(立即发布)',
    value: 0,
  },
  PUBLISH: {
    label: '是(按发布时间生效)',
    value: 1,
  },
}

/**
 * 是否置顶
 */
export const noticeTopEnums: DictEnum<number, 'NO' | 'YES'> = {
  NO: {
    label: '否',
    value: 0,
  },
  YES: {
    label: '是',
    value: 1,
  },
}

/**
 * 通知状态
 */
export const noticeStatusEnums: DictEnum<number, 'NOT_PUBLISH' | 'PUBLISH' | 'UNDER_SHELVE' | 'EXPIRED'> = {
  NOT_PUBLISH: {
    label: '未发布',
    value: 0,
  },
  PUBLISH: {
    label: '已发布',
    value: 1,
  },
  UNDER_SHELVE: {
    label: '已下架',
    value: 2,
  },
  EXPIRED: {
    label: '已过期',
    value: 3,
  },
}

/**
 * 通知权限类型枚举 0:角色权限;1:用户权限;2:部门权限
 */
export const noticePermTypeEnums: DictEnum<number, 'ROLE_PERM' | 'USER_PERM' | 'DEPT_PERM'> = {
  ROLE_PERM: { label: '角色权限', value: 0 },
  USER_PERM: { label: '用户权限', value: 1 },
  DEPT_PERM: { label: '部门权限', value: 2 },
}
