import type { NoticeTypeStatus } from '@/service/model/notice/type.model'
import type { NoticeJumpType, NoticeStatus, NoticeTimedPublish, NoticeTop } from '@/service/model/notice/base.model'

/**
 * 通知类型状态枚举
 */
export const noticeTypeStatusEnums: DictEnum<NoticeTypeStatus, 'NOT_ENABLE' | 'ENABLE'> = {
  NOT_ENABLE: {
    label: '未启用',
    value: 0,
    type: 'danger',
  },
  ENABLE: {
    label: '启用',
    value: 1,
    type: 'success',
  },
}

/**
 * 跳转类型
 */
export const noticeJumpTypeEnums: DictEnum<NoticeJumpType, 'NO_JUMP' | 'INNER_PAGE' | 'OUTER_LINK'> = {
  NO_JUMP: {
    label: '无跳转',
    value: 0,
    type: 'info',
  },
  INNER_PAGE: {
    label: '内部页面',
    value: 1,
    type: 'success',
  },
  OUTER_LINK: {
    label: '外部链接',
    value: 2,
    type: 'primary',
  },
}

/**
 * 是否定时发布
 */
export const noticeTimedPublishEnums: DictEnum<NoticeTimedPublish, 'NOT_PUBLISH' | 'PUBLISH'> = {
  NOT_PUBLISH: {
    label: '否(立即发布)',
    value: 0,
    type: 'success',
  },
  PUBLISH: {
    label: '是(按发布时间生效)',
    value: 1,
    type: 'primary',
  },
}

/**
 * 是否置顶
 */
export const noticeTopEnums: DictEnum<NoticeTop, 'NO' | 'YES'> = {
  NO: {
    label: '否',
    value: 0,
    type: 'info',
  },
  YES: {
    label: '是',
    value: 1,
    type: 'primary',
  },
}

/**
 * 通知状态
 */
export const noticeStatusEnums: DictEnum<NoticeStatus, 'NOT_PUBLISH' | 'PUBLISH' | 'UNDER_SHELVE' | 'EXPIRED'> = {
  NOT_PUBLISH: {
    label: '未发布',
    value: 0,
    type: 'primary',
  },
  PUBLISH: {
    label: '已发布',
    value: 1,
    type: 'success',
  },
  UNDER_SHELVE: {
    label: '已下架',
    value: 2,
    type: 'danger',
  },
  EXPIRED: {
    label: '已过期',
    value: 3,
    type: 'info',
  },
}
