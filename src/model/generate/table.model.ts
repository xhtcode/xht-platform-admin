import type {
  BasicResponse,
  BasicFormRequest,
  ModeIdType,
  PageQueryRequest,
} from '@/model/base.model'

/**
 * 操作类型
 */
export interface GenTableInfoOperationRequest extends BasicFormRequest {
  /**
   *表ID
   */
  id: ModeIdType
  /**
   *分组id
   */
  groupId: ModeIdType
  /**
   *数据源ID
   */
  dataSourceId: ModeIdType
  /**
   *引擎名称
   */
  engineName: string
  /**
   *数据库表名
   */
  tableName: string
  /**
   *表注释
   */
  tableComment: string
  /**
   *生成的类名
   */
  codeName: string
  /**
   *代码的注释
   */
  codeComment: string
  /**
   *创建时间
   */
  tableCreateTime: string
  /**
   *更新时间
   */
  tableUpdateTime: string
}

/**
 * 查询请求类型
 */
export interface GenTableInfoQueryRequest extends PageQueryRequest {
  /**
   *分组id
   */
  groupId?: ModeIdType
  /**
   *数据源ID
   */
  dataSourceId?: ModeIdType
  /**
   *引擎名称
   */
  engineName?: string
  /**
   *表注释
   */
  tableComment?: string
  /**
   *创建时间
   */
  tableCreateTimeStart?: string
  tableCreateTimeEnd?: string
  /**
   *更新时间
   */
  tableUpdateTimeStart?: string
  tableUpdateTimeEnd?: string
}

/**
 * 响应类型
 */
export interface GenTableInfoResponse extends BasicResponse {
  /**
   *表ID
   */
  id: ModeIdType
  /**
   *分组id
   */
  groupId: ModeIdType
  /**
   *数据源ID
   */
  dataSourceId: ModeIdType
  /**
   *引擎名称
   */
  engineName: string
  /**
   *数据库表名
   */
  tableName: string
  /**
   *表注释
   */
  tableComment: string
  /**
   *生成的类名
   */
  codeName: string
  /**
   *代码的注释
   */
  codeComment: string
  /**
   *创建时间
   */
  tableCreateTime: string
  /**
   *更新时间
   */
  tableUpdateTime: string
}
