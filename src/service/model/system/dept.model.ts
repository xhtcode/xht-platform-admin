import { UserStatusType, UserType } from '@/service/model/system/user.model'
import { SysDeptPostStatusType } from '@/service/model/system/dept.post.model'

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
  deptSort: number // 部门顺序
  ancestors: string //祖先列表
  leader: string //负责人
  phone: string //联系电话
  email: string //邮箱
  leaderName: string // 负责人名称
  remark?: string //备注
  hashChild?: boolean
}

/**
 * 树形结构响应类型
 */
export interface SysDeptTreeResponse extends SysDeptResponse {
  children?: SysDeptTreeResponse[]
}

/**
 * 部门负责人职位信息
 */
export interface LeaderPostResponse {
  postType: string // 职位类型
  postCode: string //  岗位编码
  postName: string // 岗位名称
  remark: string // 岗位描述
  postStatus: SysDeptPostStatusType // 岗位状态
}

/**
 * 岗位用户响应信息
 */
export interface LeaderUserResponse {
  userName: string // 用户账号
  nickName: string // 用户昵称
  userStatus: UserStatusType // 账号状态
  userPhone: string // 手机号码
}

/**
 * 操作类型
 */
export interface SysDeptOperationRequest extends Partial<SysDeptResponse>, BasicFormRequest {
  leaderPost: Partial<LeaderPostResponse> // 负责人职位信息
  leaderUser: Partial<LeaderUserResponse> // 负责人用户信息
}
