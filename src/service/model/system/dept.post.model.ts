/**
 * 部门状态
 */
export type SysDeptPostStatusType = 0 | 1

/**
 * 查询请求类型
 */
export interface SysDeptPostQueryRequest extends PageQueryRequest {
  deptId?: ModeIdType //  部门id
  postCode?: string //  岗位编码
  postName?: string // 岗位名称
  postStatus?: SysDeptPostStatusType // 岗位状态
}

/**
 * 响应类型
 */
export interface SysDeptPostResponse extends MetaResponse {
  id: ModeIdType // 岗位id
  deptId: ModeIdType //  部门id
  postCode: string //  岗位编码
  postName: string // 岗位名称
  postStatus: SysDeptPostStatusType // 岗位状态
  postSort: number // 岗位排序
  deptLeader: boolean // 部门领导岗位
  quotaNum: number // 岗位编制人数
  currentNum: number // 岗位在岗人数
  remark: string // 岗位描述
}

/**
 * 操作类型
 */
export interface SysDeptPostOperationRequest extends Partial<SysDeptPostResponse>, BasicFormRequest {}
