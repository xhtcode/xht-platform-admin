import type { BasicFormRequest, BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'

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
   * 模板数量
   */
  templateCount: number

  /**
   * 分组描述
   */
  groupDesc: string

  /**
   * 分组排序
   */
  groupSort: number
}

/**
 * 操作类型
 */
export interface GenTemplateGroupOperationRequest extends GenTemplateGroupResponse, BasicFormRequest {}
