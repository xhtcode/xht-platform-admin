/**
 * 部门状态
 */
export type SysAreaHashChildType = 0 | 1

/**
 * 系统管理-行政区划查询请求参数类型
 */
export interface SysAreaQueryRequest extends PageQueryRequest {
  parentAreaCode: string // 上级
}

/**
 * 系统管理-行政区划响应类型
 */
export interface SysAreaResponse extends MetaResponse {
  /**
   * 主键
   */
  id: ModeIdType
  /**
   * 区划编码
   * */
  areaCode: string
  /**
   * 上级区划编码
   * */
  parentAreaCode: string
  /**
   * 区划名称
   */
  areaName: string
  /**
   * 邮政编码
   */
  areaPostCode: string
  /**
   * 经度
   */
  areaLongitude: string
  /**
   * 纬度
   */
  areaLatitude: string
  /**
   * 排序
   */
  areaSort: number
  /**
   * 是否存在下级
   */
  hasChild: SysAreaHashChildType
}

/**
 * 系统管理-行政区划树响应类型
 */
export interface SysAreaTreeResponse extends SysAreaResponse {
  children?: SysAreaTreeResponse[]
}
/**
 * 系统管理-行政区划表单请求参数类型
 */
export interface SysAreaOperationRequest extends Partial<SysAreaResponse>, BasicFormRequest {}
