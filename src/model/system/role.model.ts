import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'

/**
 * 角色状态枚举
 */
export enum RoleStatusEnums {
  NORMAL = 0, // 正常
  DISABLE = 1, // 停用
}

/**
 * 操作类型
 */
export interface SysRoleOperationRequest {
  id: ModeIdType // 角色ID
  roleCode: string //角色编码
  roleName: string //角色名称
  remark: string //角色描述
  dataScope: number //数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5本岗位数据权限  6仅本人数据权限）
  roleStatus: RoleStatusEnums //状态（0正常 1停用）,可用值:0,1
  roleSort: number //显示顺序
}

/**
 * 查询请求类型
 */
export interface SysRoleQueryRequest extends PageQueryRequest {}

/**
 * 响应类型
 */
export interface SysRoleResponse extends BasicResponse {
  id: ModeIdType // 角色ID
  roleCode: string //角色编码
  roleName: string //角色名称
  remark: string //角色描述
  dataScope: number //数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5本岗位数据权限  6仅本人数据权限）
  roleStatus: RoleStatusEnums //状态（0正常 1停用）,可用值:0,1
  roleSort: number //显示顺序
}
