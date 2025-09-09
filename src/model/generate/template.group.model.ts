import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'

/**
 * 操作类型
 */
export interface GenTemplateGroupOperationRequest {
  /**
   * 分组ID
   */
  id: ModeIdType

  /**
   * 分组名称
   */
  groupName: string

  /**
   * 分组描述
   */
  groupDesc: string
}

/**
 * 查询请求类型
 */
export interface GenTemplateGroupQueryRequest extends PageQueryRequest {
  /**
   * 分组名称
   */
  groupName?: string
}

/**
 * 响应类型
 */
export interface GenTemplateGroupResponse extends BasicResponse {
  /**
   * 分组ID
   */
  id: ModeIdType

  /**
   * 分组名称
   */
  groupName: string

  /**
   * 分组描述
   */
  groupDesc: string
}
