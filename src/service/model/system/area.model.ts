/**
 * 系统管理-行政区划查询请求参数类型
 */
export interface SysAreaQueryRequest extends PageQueryRequest {
  parentId: ModeIdType // 上级
}

/**
 * 系统管理-行政区划响应类型
 */
export interface SysAreaResponse extends MetaResponse {
  id: ModeIdType // 主键
  parentId: ModeIdType // 上级
  areaCode: string // 区划编码
  areaName: string // 区划名称
  areaPostCode: string // 邮政编码
  areaLongitude: string // 经度
  areaLatitude: string // 纬度
  areaSort: number // 排序
  hasChild: number // 是否存在下级
}

/**
 * 系统管理-行政区划表单请求参数类型
 */
export interface SysAreaOperationRequest extends Partial<SysAreaResponse>, BasicFormRequest {}
