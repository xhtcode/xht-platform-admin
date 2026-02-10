import { SysMenuResponse } from '@/service/model/system/menu.model'

/**
 * 角色状态
 */
export type RoleStatus = 0 | 1

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
  dataScope: number //数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5本岗位数据权限  6仅本人数据权限）
  roleStatus: RoleStatus //状态（0正常 1停用）,可用值:0,1
  roleSort: number //显示顺序
}

/**
 * 角色已选菜单响应参数
 */
export interface RoleSelectedMenuResponse {
  /**
   * 是否全选
   */
  checkAll: boolean
  /**
   * 已选的菜单id
   */
  checkedKeys: ModeIdType[]

  /**
   * 菜单列表
   */
  menuList: INodeResponse<SysMenuResponse>[]
}

/**
 * 操作类型
 */
export interface SysRoleOperationRequest extends Partial<SysRoleResponse>, BasicFormRequest {}

/**
 * 角色菜单绑定请求参数
 */
export interface SysRoleMenuBindForm extends BasicFormRequest {
  roleId: ModeIdType // 角色ID
  menuIds: ModeIdType[] // 菜单ID
}
