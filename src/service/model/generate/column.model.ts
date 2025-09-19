import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'
import { LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

type ColumnInfoTypeMapping = {
  languageType: LanguageTypeEnums // 语言类型
  columnType: string // 字段类型
  importPackage: string //导入包路径（如：java.time.LocalDateTime）
  defaultValue: string // 默认值
}

/**
 * 字典扩展配置
 */
export interface GenColumnInfoExtConfig {
  /**
   *表单项 0：否 1：是
   */
  formItem: string
  /**
   *表单必填 0：否 1：是
   */
  formRequired: string
  /**
   *表单类型
   */
  formType: string
  /**
   *列表项 0：否 1：是
   */
  gridItem: string
  /**
   *列表排序 0：否 1：是
   */
  gridSort: string
  /**
   *查询项 0：否 1：是
   */
  queryItem: string
  /**
   *查询方式
   */
  queryType: string
  /**
   *查询表单类型
   */
  queryFormType: string
  /**
   * 类型映射
   */
  typeMappings: ColumnInfoTypeMapping[]
}

/**
 * 操作类型
 */
export interface GenColumnInfoOperationRequest {
  /**
   *id
   */
  id: ModeIdType
  /**
   *表ID
   */
  tableId: ModeIdType
  /**
   *数据库字段名
   */
  columnName: string
  /**
   *数据库字段类型
   */
  dbDataType: string
  /**
   *字段注释
   */
  columnComment: string
  /**
   * 字段长度
   */
  columnLength: number
  /**
   * 代码名称
   */
  codeName: string
  /**
   * 代码注释
   */
  codeComment: string
  /**
   * 代码字段长度
   */
  codeLength: number
  /**
   *字段默认值
   */
  defaultValue: string
  /**
   *是否必填
   */
  isRequired: number
  /**
   *是否主键
   */
  isPrimary: number
  /**
   * 字段扩展
   */
  extConfig: GenColumnInfoExtConfig
  /**
   *字段排序
   */
  sortOrder: number
  /**
   * 列表描述
   */
  listComment: number
  /**
   * 列宽度
   */
  listWidth: number | null
  /**
   * 溢出提示
   */
  listOverflowTooltip: number
  /**
   * 默认隐藏
   */
  listHidden: number
  /**
   * 显示禁用
   */
  listDisabled: number
  /**
   * 显示
   */
  listShow: number
}

/**
 * 查询请求类型
 */
export interface GenColumnInfoQueryRequest extends PageQueryRequest {
  /**
   *表ID
   */
  tableId?: ModeIdType
}

/**
 * 响应类型
 */
export interface GenColumnInfoResponse extends BasicResponse {
  /**
   *id
   */
  id: ModeIdType
  /**
   *表ID
   */
  tableId: ModeIdType
  /**
   *数据库字段名
   */
  columnName: string
  /**
   *数据库字段类型,可用值:MySql,Oracle
   */
  dbDataType: string
  /**
   *字段注释
   */
  columnComment: string
  /**
   *字段默认值
   */
  defaultValue: string
  /**
   *是否必填
   */
  isRequired: number
  /**
   *是否主键
   */
  isPrimary: number
  /**
   * 字段扩展
   */
  extConfig: GenColumnInfoExtConfig
  /**
   *字段排序
   */
  sortOrder: number
}
