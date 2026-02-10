import type { SysDeptPostResponse } from '@/service/model/system/dept.post.model'

/**
 * 用户类型
 */
export type UserType = 1 | 2 | 3

/**
 * 用户状态
 */
export type UserStatusType = 0 | 1 | 2 | 3 | 4

/**
 * 查询请求类型
 */
export interface SysUserQueryRequest extends PageQueryRequest {
  userType?: UserType // 用户类型
  userName?: string // 用户账号
  nickName?: string // 用户昵称
  userStatus?: UserStatusType // 账号状态
  userPhone?: string // 手机号码
  deptId?: number // 部门ID
}

/**
 * 响应类型
 */
export interface SysUserProfileResponse extends BasicResponse {
  id?: ModeIdType // 信息ID
  userId?: ModeIdType // 用户id
  realName?: string // 真实姓名
  idCard?: string // 身份证号
  gender?: number // 用户性别（例如：1-男，2-女，0-未知）
  birthDate?: string // 出生日期（格式通常为 'yyyy-MM-dd'）
  age?: number // 用户年龄
  address?: string // 用户地址
  postalCode?: string // 邮政编码
  emergencyContact?: string // 紧急联系人
  emergencyPhone?: string // 紧急联系人电话
  nation?: string // 用户民族
}

/**
 * 响应类型
 */
export interface SysUserResponse extends MetaResponse {
  id: ModeIdType // 用户ID
  userType: UserType // 用户类型
  userName: string // 用户名
  nickName: string // 用户昵称
  userStatus: UserStatusType // 用户状态
  userPhone: string //手机号码
  userAvatar: string // 头像
  deptId: ModeIdType // 部门ID
  deptName: string // 部门名称
}

/**
 * 响应类型
 */
export interface SysUserVo extends Partial<SysUserResponse> {
  profile: SysUserProfileResponse // 用户信息
  postInfos: SysDeptPostResponse[] // 岗位信息
}

/**
 * 简单用户信息
 */
export interface UserSimpleVo {
  userId: ModeIdType // 用户id
  deptId: ModeIdType // 部门id
  userName: string // 用户名
  nickName: string // 昵称
  avatarUrl: string // 头像地址
  userStatus: UserStatusType // 账号状态
}

/**
 * 部门用户props
 */
export interface DeptUserProps {
  modelValue?: ModeIdType
}

/**
 * 操作类型
 */
export interface SysUserOperationRequest extends SysUserVo, BasicFormRequest {}

/**
 * 绑定信息
 */
export interface UserRoleBindOperationRequest extends BasicFormRequest {
  userId: ModeIdType
  roleIds: ModeIdType[]
}
