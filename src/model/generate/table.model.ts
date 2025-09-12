import type {
  BasicFormRequest,
  BasicResponse,
  ModeIdType,
  PageQueryRequest,
} from '@/model/base.model'
import { GenColumnInfoResponse } from '@/model/generate/column.model'

/**
 * 操作类型
 */
export interface GenTableInfoOperationRequest extends BasicFormRequest {
  /**
   * 表信息
   */
  tableInfo: GenTableInfoResponse
  /**
   * 字段信息
   */
  columnInfos: GenColumnInfoResponse[]
  /**
   * 查询字段信息
   */
  queryColumns: any[]
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
   *模块名称
   */
  moduleName: string
  /**
   *代码名称
   */
  codeName: string
  /**
   *代码注释
   */
  codeComment: string
  /**
   * 后端作者
   */
  backEndAuthor: string
  /**
   * 前端作者
   */
  frontEndAuthor: string
  /**
   *页面风格
   */
  pageStyle: string
  /**
   * 页面宽度
   */
  pageStyleWidth: string
  /**
   * 每行数量
   */
  fromNumber: number
  /**
   * 权限前缀
   */
  permissionPrefix: string
  /**
   * 上级菜单
   */
  parentMenuId: ModeIdType
  /**
   *创建时间
   */
  tableCreateTime: string
  /**
   *更新时间
   */
  tableUpdateTime: string
}
