/**
 * 字典状态枚举
 */
export enum DictStatusEnums {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 查询请求类型
 */
export interface SysDictQueryRequest extends PageQueryRequest {
  dictCode?: string //字典编码
  dictName?: string //字典名称
  status?: DictStatusEnums //状态(1:启用 0:禁用)
}

/**
 * 响应类型
 */
export interface SysDictResponse extends MetaResponse {
  id: ModeIdType //字典ID
  dictCode: string //字典编码
  dictName: string //字典名称
  sortOrder: number //排序序号
  remark: string //字典描述
  status: DictStatusEnums //状态(1:启用 0:禁用)
}

/**
 * 操作类型
 */
export interface SysDictOperationRequest extends Partial<SysDictResponse>, BasicFormRequest {}
