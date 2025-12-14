import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 查询请求类型
 */
export interface GenTypeMappingQueryRequest extends PageQueryRequest {
  /**
   * 数据库类型
   */
  dbType?: string
}

/**
 * 响应类型
 */
export interface GenTypeMappingResponse extends BasicResponse {
  /**
   * 映射ID
   */
  id: ModeIdType
  /**
   * 数据库类型（MySQL/Oracle）
   */
  dbType: DataBaseTypeEnums
  /**
   * 数据库数据类型（如：INT/VARCHAR2）
   */
  dbDataType: string
  /**
   * java类型
   */
  javaType: string
  /**
   * java包类型
   */
  importPackage: string
  /**
   * ts 类型
   */
  tsType: string
}

/**
 * 操作类型
 */
export interface GenTypeMappingOperationRequest extends Partial<GenTypeMappingResponse> {}
