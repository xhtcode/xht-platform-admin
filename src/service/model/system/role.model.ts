import type { SysMenuTreeResponse } from '@/service/model/system/menu.model'

/**
 * 角色状态
 */
export type RoleStatus = 0 | 1
/**
 * 角色类型
 */
export type DataScope = 1 | 2 | 3 | 4 | 5
/**
 * 查询请求类型
 */
export interface SysRoleQueryRequest extends PageQueryRequest {}

/**
 * 响应类型
 */
export interface SysRoleResponse extends MetaResponse {
  id: ModeIdType // 角色ID
  roleCode: string //角色编码
  roleName: string //角色名称
  remark: string //角色描述
  dataScope: number //数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限  5仅本人数据权限）
  roleStatus: RoleStatus //状态（0正常 1停用）,可用值:0,1
  roleSort: number //显示顺序
  roleTypeId?: ModeIdType // 角色类型ID
  roleTypeName?: string | null // 角色类型名称，未绑定类型时为 null
}

/**
 * 角色已选菜单响应参数
 */
export interface RoleSelectedMenuResponse {
  /**
   * 已选的菜单id
   */
  checkedMenuIds: ModeIdType[]
  /**
   * 菜单总数
   */
  menuTotal: number
  /**
   * 菜单列表
   */
  menuList: SysMenuTreeResponse[]
}

/**
 * 操作类型
 */
export interface SysRoleOperationRequest extends Partial<SysRoleResponse>, BasicFormRequest {}

/**
 * 角色菜单绑定VO
 */
export interface SysRoleMenuBindVO extends BasicResponse {
  userId: ModeIdType // 用户ID
  bindRoleIds: ModeIdType[] // 已绑定的roleIds
  roles: SysRoleResponse[] // 全部的角色信息
  allChecked: boolean // 是否全选
  indeterminate: boolean // 是否半选
}

/**
 * 角色菜单绑定请求参数
 */
export interface SysRoleMenuBindForm extends BasicFormRequest {
  roleId: ModeIdType // 角色ID
  menuIds: ModeIdType[] // 菜单ID
}
