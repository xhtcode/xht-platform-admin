/**
 * 系统管理-通知详情查询请求参数类型
 */
export interface SysNoticeQueryRequest extends PageQueryRequest {
  noticeTitle?: string // 通知标题
  noticePublishTimeStart?: string // 发布开始时间
  noticePublishTimeEnd?: string // 发布结束时间
  noticeExpireTimeStart?: string // 过期开始时间
  noticeExpireTimeEnd?: string // 过期结束时间
  noticeOfflineTimeStart?: string // 下架开始时间
  noticeOfflineTimeEnd?: string // 下架结束时间
}

/**
 * 系统管理-通知详情响应类型
 */
export interface SysNoticeResponse extends MetaResponse {
  id: ModeIdType // 通知ID
  noticeTypeId: ModeIdType // 通知类型
  noticeTypeName: string // 通知类型
  noticeTitle: string // 通知标题
  noticeSummary: string // 通知摘要
  noticeContent: string // 通知内容
  noticeStatus: number // 通知状态
  noticeOrder: number // 通知排序
  noticeTop: number // 是否置顶
  noticeTimedPublish: number // 是否定时发布
  noticePublishTime: string // 发布时间
  noticeExpireTime: string // 过期时间
  noticeOfflineTime: string // 下架时间
  noticeJumpType: number // 跳转类型
  noticeJumpUrl: string // 跳转地址
  noticeReadCount: number // 已读人数
  noticeClickCount: number // 点击次数
  noticeRemark: string // 备注
}

/**
 * 系统管理-通知详情表单请求参数类型
 */
export interface SysNoticeOperationRequest extends Partial<SysNoticeResponse>, BasicFormRequest {}

/**
 * 系统管理-通知附件响应类型
 */
export interface SysNoticeAttachmentResponse extends BasicResponse {
  id: ModeIdType // 附件ID
  noticeId: number // 关联通知ID
  attachmentName: string // 附件原始名称
  attachmentShowName: string // 附件显示名称
  attachmentPath: string // 附件存储路径
  attachmentSize: number // 附件大小
  attachmentType: string // 附件类型
  attachmentOrder: number // 附件排序
}

/**
 * 系统管理-通知详情表单响应类型
 */
export interface NoticeVo {
  notice: SysNoticeOperationRequest
  attachments: SysNoticeAttachmentResponse[]
}
