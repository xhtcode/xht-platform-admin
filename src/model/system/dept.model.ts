import type { BasicResponse, INodeResponse, ModeIdType, PageQueryRequest } from '@/model/base.model'

/**
 * 定义部门状态枚举类型
 */
export enum DeptStatusEnums {
  NORMAL = 0, // 激活
  DISABLE = 1, // 停用
}

/**
 * 操作类型
 */
export interface SysDeptOperationRequest {
  id: ModeIdType //部门id
  parentId: ModeIdType // 父部门ID
  leaderUserId: ModeIdType // 负责人ID
  leaderName: string // 负责人ID
  deptCode: string // 部门编码
  deptName: string // 部门名称
  deptStatus: DeptStatusEnums // 部门状态,可用值:0,1
  deptSort: number // 显示顺序
  phone: string //联系电话
  email: string //邮箱
  remark?: string //备注
}

/**
 * 查询请求类型
 */
export interface SysDeptQueryRequest extends PageQueryRequest {
  deptCode?: string // 部门编码
  deptName?: string // 部门名称
  deptStatus?: DeptStatusEnums // 部门状态
}

/**
 * 响应类型
 */
export interface SysDeptResponse extends BasicResponse {
  id: ModeIdType //部门id
  parentId: ModeIdType // 父部门ID
  deptCode: string // 部门编码
  deptName: string // 部门名称
  deptStatus: DeptStatusEnums // 部门状态,可用值:0,1
  deptSort: number // 显示顺序
  ancestors: string //祖先列表
  leader: string //负责人
  phone: string //联系电话
  email: string //邮箱
  remark?: string //备注
  hashChild?: boolean
}

/**
 * 菜单树响应类型
 */
export type SysDeptTreeResponse = INodeResponse<SysDeptResponse>[]
