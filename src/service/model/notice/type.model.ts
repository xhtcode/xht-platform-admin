/**
 * 系统管理-通知类型查询请求参数类型
 */
export interface SysNoticeTypeQueryRequest extends PageQueryRequest {
  noticeTypeName?: string // 类型名称
  noticeTypeStatus?: NoticeTypeStatusEnums // 通知类型状态
}

/**
 * 系统管理-通知类型响应类型
 */
export interface SysNoticeTypeResponse extends MetaResponse {
  id: ModeIdType // 通知类型
  noticeTypeName: string // 类型名称
  noticeTypeStatus: NoticeTypeStatusEnums // 通知类型状态
  noticeTypeSort: number // 通知排序
}

/**
 * 系统管理-通知类型表单请求参数类型
 */
export interface SysNoticeTypeOperationRequest extends Partial<SysNoticeTypeResponse>, BasicFormRequest {}

/**
 * 通知类型状态枚举
 * 0:未启用 1:启用
 * 对应Java：NoticeTypeStatusEnums
 */
export enum NoticeTypeStatusEnums {
  // 未启用
  NOT_ENABLE = 0,
  // 启用
  ENABLE = 1,
}
