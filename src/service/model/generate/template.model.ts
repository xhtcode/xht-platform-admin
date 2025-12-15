import type { BasicFormRequest, BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'

/**
 * 查询请求类型
 */
export interface GenTemplateQueryRequest extends PageQueryRequest {
  /**
   * 分组id
   */
  groupId?: ModeIdType
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
  templateName: string
  /**
   * 模板内容
   */
  templateContent: string
  /**
   * 文件路径模板
   */
  templateFilePath: string
  /**
   * 文件名模板
   */
  templateFileName: string
  /**
   * 文件类型
   */
  templateFileType: string
  /**
   * 忽略的字段
   */
  templateIgnoreField: string[]
  /**
   * 模板排序
   */
  templateSort: number
}

/**
 * 操作类型
 */
export interface GenTemplateOperationRequest extends Partial<GenTemplateResponse>, BasicFormRequest {
  isNew?: boolean
}
