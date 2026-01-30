export enum GenStatusEnums {
  DISABLED = 0, // 不显示/非必填/禁用/隐藏
  ENABLED = 1, // 显示/必填/启用/不隐藏
}

/**
 * 响应类型
 */
export interface GenColumnInfoResponse extends MetaResponse {
  /**
   * 主键
   */
  id: ModeIdType

  /**
   * 表id
   */
  tableId: ModeIdType

  /**
   * 表名称(冗余字段)
   */
  tableName: string

  /**
   * 字段名
   */
  dbName: string

  /**
   * 字段类型
   */
  dbType: string

  /**
   * 字段主键：0-非主键，1-主键
   */
  dbPrimary: GenStatusEnums

  /**
   * 字段必填：0-非必填，1-必填
   */
  dbRequired: GenStatusEnums

  /**
   * 字段注释
   */
  dbComment: string

  /**
   * 字段长度
   */
  dbLength: number

  /**
   * 代码名称
   */
  codeName: string

  /**
   * 代码注释
   */
  codeComment: string

  /**
   * 表单新增：0-不显示，1-显示
   */
  fromInsert: GenStatusEnums

  /**
   * 表单更新：0-不显示，1-显示
   */
  fromUpdate: GenStatusEnums

  /**
   * 表单输入长度
   */
  fromLength?: number // 允许为null，故设为可选

  /**
   * 表单必填：0-非必填，1-必填
   */
  fromFill: GenStatusEnums

  /**
   * 表单组件
   */
  fromComponent: string

  /**
   * 列表显示：0-不显示，1-显示
   */
  listShow: GenStatusEnums

  /**
   * 列表禁用：0-不禁用，1-禁用
   */
  listDisabled: GenStatusEnums

  /**
   * 默认隐藏：0-不隐藏，1-隐藏
   */
  listHidden: GenStatusEnums

  /**
   * java类型
   */
  codeJava: string

  /**
   * 列表排序
   */
  listSortable: GenStatusEnums

  /**
   * java类型 包地址
   */
  codeJavaPackage: string

  /**
   * ts类型
   */
  codeTs: string

  /**
   * 字典编码
   */
  dictCode: string

  /**
   * 字段排序
   */
  sortOrder: number
}

/**
 * 代码生成器-查询条件
 * 对应Java类：GenTableColumnQueryResponse
 */
export interface GenTableColumnQueryResponse {
  /**
   * 主键
   */
  id: ModeIdType

  /**
   * 表id
   */
  tableId: ModeIdType

  /**
   * 表名称(冗余字段)
   */
  tableName: string

  /**
   * 字段id
   */
  columnId: ModeIdType

  /**
   * 字段名称
   */
  columnName: string

  /**
   * 表单输入长度（可为null，故设为可选）
   */
  fromLength: number

  /**
   * 查询类型（如等于、不等于、大于、小于等）
   */
  queryType: string

  /**
   * 条件标签（显示用的文本）
   */
  conditionLabel: string

  /**
   * 字段值（字段命名）
   */
  conditionValue: string

  /**
   * 表单组件
   */
  fromComponent: string
  /**
   * 字典编码
   */
  dictCode: string | null
  /**
   * 字段排序
   */
  sortOrder: number
}

/**
 * 操作类型
 */
export interface GenColumnInfoOperationRequest extends Partial<GenColumnInfoResponse> {}
