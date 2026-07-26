import type { MessageStar, MessageStatus, MessageTop, MessageType } from '@/service/model/system/message.model'

/**
 * 信息类型
 */
export const messageTypeEnum: DictEnum<MessageType, 'SYSTEM' | 'BUSINESS'> = {
  SYSTEM: {
    label: '系统通知',
    value: 1,
    type: 'success',
  },
  BUSINESS: {
    label: '业务提醒',
    value: 2,
    type: 'primary',
  },
}

/**
 * 信息收藏：0-否 1-是
 * 对应Java的MessageStarEnum枚举
 */
export const messageStarEnum: DictEnum<MessageStar, 'NO' | 'YES'> = {
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
 * 信息置顶：0-否 1-是
 * 对应Java的MessageTopEnum枚举
 */
export const messageTopEnum: DictEnum<MessageTop, 'NO' | 'YES'> = {
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
 * 信息状态
 */
export const messageStatusEnum: DictEnum<MessageStatus, 'UNREAD' | 'READ' | 'DELETED' | 'WITHDRAWN'> = {
  UNREAD: {
    label: '未读',
    value: 1,
    type: 'info',
  },
  READ: {
    label: '已读',
    value: 2,
    type: 'success',
  },
  DELETED: {
    label: '已删除',
    value: 3,
    type: 'danger',
  },
  WITHDRAWN: {
    label: '已撤回',
    value: 4,
    type: 'warning',
  },
}
