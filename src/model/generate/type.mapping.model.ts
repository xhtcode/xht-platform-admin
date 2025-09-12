import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/common/enums/generate/generate.enums'

/**
 * 操作类型
 */
export interface GenTypeMappingOperationRequest {
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
   * 目标编程语言（Java/TypeScript）
   */
  targetLanguage: LanguageTypeEnums
  /**
   * 目标语言数据类型（如：Integer/number）
   */
  targetDataType: string
  /**
   * 导入包路径（如：java.time.LocalDateTime）
   */
  importPackage: string
}

/**
 * 查询请求类型
 */
export interface GenTypeMappingQueryRequest extends PageQueryRequest {
  /**
   * 数据库类型（MySQL/Oracle）
   */
  dbType?: DataBaseTypeEnums
  /**
   * 目标编程语言（Java/TypeScript）
   */
  targetLanguage?: LanguageTypeEnums
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
   * 目标编程语言（Java/TypeScript）
   */
  targetLanguage: LanguageTypeEnums
  /**
   * 目标语言数据类型（如：Integer/number）
   */
  targetDataType: string
  /**
   * 导入包路径（如：java.time.LocalDateTime）
   */
  importPackage: string
}
