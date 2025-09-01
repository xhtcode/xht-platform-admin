import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'

/**
 * 操作类型
 */
export interface GenLogOperationRequest {
  /**
   *历史记录ID
   */
  id: ModeIdType
  /**
   *项目ID
   */
  projectId: ModeIdType
  /**
   *生成批次号
   */
  batchNo: string
  /**
   *生成时间
   */
  generateTime: string
  /**
   *生成文件数量
   */
  fileCount: number
  /**
   *生成的表ID
   */
  tableIds: string
  /**
   *生成状态
   */
  status: string
  /**
   *错误信息
   */
  errorMsg: string
}

/**
 * 查询请求类型
 */
export interface GenLogQueryRequest extends PageQueryRequest {
  /**
   *生成批次号
   */
  batchNo?: string
  /**
   * 分组id
   */
  groupId?: ModeIdType
  /**
   * 生成时间
   */
  generateTimeStart?: string
  /**
   * 生成时间
   */
  generateTimeEnd?: string
}

/**
 * 响应类型
 */
export interface GenLogResponse extends BasicResponse {
  /**
   *历史记录ID
   */
  id: ModeIdType
  /**
   *项目ID
   */
  projectId: ModeIdType
  /**
   *生成批次号
   */
  batchNo: string
  /**
   *生成时间
   */
  generateTime: string
  /**
   *生成文件数量
   */
  fileCount: number
  /**
   *生成的表ID
   */
  tableIds: string
  /**
   *生成状态
   */
  status: string
  /**
   *错误信息
   */
  errorMsg: string
}
