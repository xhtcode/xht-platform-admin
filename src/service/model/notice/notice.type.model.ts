/**
 * 系统管理-通知类型响应类型
 */
export interface SysNoticeTypeResponse extends BasicResponse {
  id: ModeIdType // 通知类型id
  noticeTypeName: string // 类型名称
  noticeTypeSort: number // 通知排序
}

/**
 * 系统管理-通知类型表单请求参数类型
 */
export interface SysNoticeTypeOperationRequest extends Partial<SysNoticeTypeResponse>, BasicFormRequest {}
