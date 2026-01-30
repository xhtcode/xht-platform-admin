/**
 * 字典状态枚举
 */
export enum DictItemStatusEnums {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 查询请求类型
 */
export interface SysDictItemQueryRequest extends PageQueryRequest {
  dictId: ModeIdType // 所属字典ID
  dictCode?: string // 字典项编码
  itemLabel?: string // 字典项标签
  itemValue?: string // 字典项值
  status?: DictItemStatusEnums //状态(1:启用 0:禁用)
}

/**
 * 响应类型
 */
export interface SysDictItemResponse extends MetaResponse {
  id: ModeIdType // 字典项ID
  dictId: ModeIdType // 所属字典ID
  dictCode: string // 字典项编码
  itemLabel: string // 字典项标签
  itemValue: string // 字典项值
  itemColor: string // 显示颜色
  sortOrder: number // 排序序号
  remark: string // 字典项描述
  status: DictItemStatusEnums //状态(1:启用 0:禁用)
}

/**
 * 操作类型
 */
export interface SysDictItemOperationRequest extends Partial<SysDictItemResponse>, BasicFormRequest {}
