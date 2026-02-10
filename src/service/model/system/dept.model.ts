/**
 * 部门状态
 */
export type DeptStatusType = 0 | 1

/**
 * 查询请求类型
 */
export interface SysDeptQueryRequest extends PageQueryRequest {
  deptCode?: string // 部门编码
  deptName?: string // 部门名称
  deptStatus?: DeptStatusType // 部门状态
}

/**
 * 响应类型
 */
export interface SysDeptResponse extends MetaResponse {
  id: ModeIdType //部门id
  parentId: ModeIdType // 父部门ID
  deptCode: string // 部门编码
  deptName: string // 部门名称
  deptStatus: DeptStatusType // 部门状态,可用值:0,1
  deptSort: number // 显示顺序
  ancestors: string //祖先列表
  leader: string //负责人
  phone: string //联系电话
  email: string //邮箱
  leaderName: string // 负责人名称
  remark?: string //备注
  hashChild?: boolean
}

/**
 * 操作类型
 */
export interface SysDeptOperationRequest extends Partial<SysDeptResponse>, BasicFormRequest {}
