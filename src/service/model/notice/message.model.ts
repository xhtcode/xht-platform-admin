/**
 * 站内信查询请求参数类型
 */
export interface SysMessageQueryRequest extends PageQueryRequest {
  messageId?: ModeIdType
  senderName?: string // 发件人名称
  messageTitle?: string // 消息标题
}

/**
 * 站内信响应类型
 */
export interface SysMessageResponse extends MetaResponse {
  id: ModeIdType // 主键ID
  senderId: number // 发件人ID
  senderName: string // 发件人名称
  messageType: number // 消息类型：1-系统通知 2-业务提醒
  cancelTime: string // 撤回时间
  messageTitle: string // 消息标题
  messageContent: string // 消息内容
  messageExtend: string // 消息扩展信息
}

// 定义状态常量，避免硬编码
export const MESSAGE_STATUS = {
  UNREAD: 1, // 未读
  READ: 2, // 已读
  DELETED: 3, // 已删除（收件人侧）
  WITHDRAWN: 4, // 已撤回（发件人侧）
}

/**
 * 信息收藏：0-否 1-是
 * 对应Java的MessageStarEnums枚举
 */
export const enum MessageStarEnums {
  NO = 0,
  YES = 1,
}

/**
 * 信息置顶：0-否 1-是
 * 对应Java的MessageTopEnums枚举
 */
export const enum MessageTopEnums {
  NO = 0,
  YES = 1,
}
