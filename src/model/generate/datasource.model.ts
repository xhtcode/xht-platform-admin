import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'
import { DataBaseTypeEnums } from '@/model/generate/common.model'

/**
 * 操作类型
 */
export interface GenDataSourceOperationRequest {
  /**
   * 数据源ID
   */
  id: ModeIdType
  /**
   * 数据源名称
   */
  name: string
  /**
   * 数据库类型
   */
  dbType: DataBaseTypeEnums
  /**
   * 数据库地址
   */
  url: string
  /**
   * 连接测试结果
   */
  testResult: string
  /**
   * 最后测试时间
   */
  lastTestTime: string
}

/**
 * 查询请求类型
 */
export interface GenDataSourceQueryRequest extends PageQueryRequest {
  /**
   * 数据源名称
   */
  name?: string
  /**
   * 数据库类型
   */
  dbType?: DataBaseTypeEnums
}

/**
 * 响应类型
 */
export interface GenDataSourceResponse extends BasicResponse {
  /**
   * 数据源ID
   */
  id: ModeIdType
  /**
   * 数据源名称
   */
  name: string
  /**
   * 数据库类型
   */
  dbType: DataBaseTypeEnums
  /**
   * 数据库地址
   */
  url: string
  /**
   * 连接测试结果
   */
  testResult: string
  /**
   * 最后测试时间
   */
  lastTestTime: string
}
