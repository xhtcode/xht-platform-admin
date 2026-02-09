import { MessageStarEnums, MessageTopEnums } from '@/service/model/notice/message.model'

/**
 * 系统管理-站内信收件人明细表响应类型
 */
export interface SysMessageInfoResponse extends BasicResponse {
  id: ModeIdType // 主键ID
  messageId: ModeIdType // 关联主表的消息唯一编号
  recipientId: ModeIdType // 收件人ID
  recipientName: string // 收件人名称
  messageStatus: number // 消息状态：1-未读 2-已读 3-已删除
  messageTop: MessageTopEnums // 信息置顶：0-否 1-是
  messageStar: MessageStarEnums // 信息收藏
  readTime: string // 阅读时间
  removeTime: string // 删除时间
}

/**
 * 站内信信息VO
 */
export interface MessageInfoVo {
  senderName: string // 发件人名称
  messageType: number // 消息类型：1-系统通知 2-业务提醒
  messageTitle: string // 消息标题
  messageContent: string // 消息内容
  messageExtend: string // 消息扩展信息
  response: SysMessageInfoResponse // 消息信息详情
}
