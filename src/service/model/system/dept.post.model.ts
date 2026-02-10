import { SystemFlagEnums } from '@/service/model/base.model'

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
  systemFlag?: SystemFlagEnums // 系统内置
}

/**
 * 响应类型
 */
export interface SysDeptPostResponse extends MetaResponse {
  id: ModeIdType // 岗位id
  deptId: ModeIdType //  部门id
  postCode: string //  岗位编码
  postName: string // 岗位名称
  postSort: number // 岗位排序
  postHave: number // 岗位人员已有人数
  postLimit: number // 岗位人员限制
  remark: string // 岗位描述
  postStatus: SysDeptPostStatusType // 岗位状态
  systemFlag: SystemFlagEnums // 系统内置
}

/**
 * 操作类型
 */
export interface SysDeptPostOperationRequest extends Partial<SysDeptPostResponse>, BasicFormRequest {}
