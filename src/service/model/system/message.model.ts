/**
 * 消息状态
 */
export type MessageType = 1 | 2
/**
 * 信息状态
 */
export type MessageStatus = 1 | 2 | 3 | 4
/**
 * 信息收藏
 */
export type MessageStar = 0 | 1
/**
 * 信息置顶
 */
export type MessageTop = 0 | 1

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
  senderId: ModeIdType // 发件人ID
  senderName: string // 发件人名称
  messageType: MessageType // 消息类型：1-系统通知 2-业务提醒
  cancelTime: string // 撤回时间
  messageTitle: string // 消息标题
  messageContent: string // 消息内容
  messageExtend: string // 消息扩展信息
}
