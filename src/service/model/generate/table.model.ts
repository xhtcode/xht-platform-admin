import type {
  BasicFormRequest,
  BasicResponse,
  ModeIdType,
  PageQueryRequest,
} from '@/service/model/base.model'
import {
  GenColumnInfoResponse,
  GenTableColumnQueryResponse,
} from '@/service/model/generate/column.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 代码生成核心返回结果
 */
export interface GenCodeCoreBo {
  filePath: string // 文件路径
  fileName: string // 文件名
  tableName: string // 表名
  code: string //生成的代码内容
  fileType: string //文件类型
  ignoreField: readonly string[] //忽略的字段
}

/**
 * 代码生成核心返回结果
 */
export interface GenCodeCoreVo {
  tableName: string // 表名
  codes: GenCodeCoreBo[] //生成的代码内容
}

/**
 * 代码预览状态管理接口
 * 用于定义代码预览功能中的各种状态变量
 */
export interface CodeViewState {
  tableIds: ModeIdType[] // 需要生成代码的表ID数组
  packageName: string // 包名
  visibleStatus: boolean // 控制代码预览弹窗显示状态
  loadingStatus: boolean // 数据加载状态标识
  codeData: GenCodeCoreVo[] // 存储获取到的代码数据
  twoCodeData: GenCodeCoreBo[] // 当前选中表对应的代码文件列表
  activeData: GenCodeCoreBo | null // 当前激活的代码数据
  activeFileType: string // 当前选中文件的类型（如 java、vue等）
  activeTableName: string // 当前激活的表名
  activeFileName: string // 当前激活的文件名
}

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
  queryColumns: GenTableColumnQueryResponse[]
}

/**
 * 导入表请求参数
 */
export interface ImportTableFormRequest {
  /**
   * 表名称
   */
  tableNames: string[]

  /**
   * 数据源id
   */
  dataSourceId: ModeIdType
  /**
   * 模板分组id
   */
  groupId: ModeIdType
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
   * 表ID
   */
  id: ModeIdType

  /**
   * 分组id
   */
  groupId: ModeIdType

  /**
   * 数据源ID
   */
  dataSourceId: ModeIdType

  /**
   * 数据库类型
   */
  dataBaseType: DataBaseTypeEnums

  /**
   * 引擎名称
   */
  engineName: string

  /**
   * 数据库表名
   */
  tableName: string

  /**
   * 表注释
   */
  tableComment: string

  /**
   * 模块名称
   */
  moduleName: string

  /**
   * 业务名称
   */
  serviceName: string

  /**
   * 代码名称
   */
  codeName: string

  /**
   * 代码注释
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
   * 请求前缀
   */
  urlPrefix: string

  /**
   * 权限前缀
   */
  permissionPrefix: string

  /**
   * 上级菜单
   */
  parentMenuId: number

  /**
   * 页面风格
   */
  pageStyle: string

  /**
   * 页面宽度
   */
  pageStyleWidth?: number

  /**
   * 每行数量
   */
  fromNumber?: number

  /**
   * 表创建时间
   */
  tableCreateTime: string

  /**
   * 表更新时间
   */
  tableUpdateTime: string
}
