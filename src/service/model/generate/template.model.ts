import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'

/**
 * 操作类型
 */
export interface GenTemplateOperationRequest {
  /**
   * 模板ID
   */
  id: ModeIdType
  /**
   * 分组id
   */
  groupId: ModeIdType
  /**
   * 模板名称
   */
  name: string
  /**
   * 模板内容（Velocity语法）
   */
  content: string
  /**
   * 文件类型
   */
  fileType: string
  /**
   * 文件路径模板
   */
  filePathTemplate: string
  /**
   * 文件名模板
   */
  fileNameTemplate: string
  /**
   * 执行条件
   */
  templateCondition?: string
}

/**
 * 查询请求类型
 */
export interface GenTemplateQueryRequest extends PageQueryRequest {
  /**
   * 分组id
   */
  groupId?: ModeIdType
  /**
   * 模板名称
   */
  name?: string
  /**
   * 文件类型
   */
  fileType?: string
}

/**
 * 响应类型
 */
export interface GenTemplateResponse extends BasicResponse {
  /**
   * 模板ID
   */
  id: ModeIdType
  /**
   * 分组id
   */
  groupId: ModeIdType
  /**
   * 模板名称
   */
  name: string
  /**
   * 模板内容（Velocity语法）
   */
  content: string
  /**
   * 文件类型
   */
  fileType: string
  /**
   * 文件路径模板
   */
  filePathTemplate: string
  /**
   * 文件名模板
   */
  fileNameTemplate: string
}
