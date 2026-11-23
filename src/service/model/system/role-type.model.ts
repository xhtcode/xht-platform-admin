import type { SysMenuTreeResponse } from '@/service/model/system/menu.model'

/**
 * 角色类型状态
 */
export type RoleTypeStatus = 0 | 1

/**
 * 角色类型查询请求类型
 */
export interface SysRoleTypeQueryRequest extends PageQueryRequest {
  typeCode?: string // 类型编码（模糊）
  typeName?: string // 类型名称（模糊）
  typeStatus?: RoleTypeStatus // 状态（0正常 1停用，不传查全部）
}

/**
 * 角色类型响应类型
 */
export interface SysRoleTypeResponse extends MetaResponse {
  id: ModeIdType // 角色类型ID
  typeCode: string // 类型编码
  typeName: string // 类型名称
  typeStatus: RoleTypeStatus // 状态（0正常 1停用）
  typeSort: number // 显示顺序
  remark?: string // 备注
}

/**
 * 角色类型表单请求类型
 */
export interface SysRoleTypeOperationRequest extends Partial<SysRoleTypeResponse>, BasicFormRequest {}

/**
 * 角色类型下拉选项（/sys/roleType/list 仅返回正常状态）
 */
export interface SysRoleTypeOption {
  id: ModeIdType // 角色类型ID
  typeCode: string // 类型编码
  typeName: string // 类型名称
}

/**
 * 角色类型已选菜单响应类型
 */
export interface RoleTypeSelectedMenuResponse {
  checkedMenuIds: ModeIdType[] // 已绑定的菜单ID（仅正常状态菜单）
  menuTotal: number // 菜单总数
  menuList: SysMenuTreeResponse[] // 全量菜单树
}

/**
 * 角色类型菜单绑定请求类型
 */
export interface SysRoleTypeMenuBindForm extends BasicFormRequest {
  roleTypeId: ModeIdType // 角色类型ID
  menuIds: ModeIdType[] // 全量勾选的菜单ID（先删后插）
}
