import type { BasicResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'
import type { SysDeptResponse } from '@/service/model/system/dept.model'
import type { SysDeptPostResponse } from '@/service/model/system/dept.post.model'

/**
 * 用户状态枚举
 */
export enum UserStatusEnums {
  NORMAL = 0, //正常状态
  DISABLE = 1, //禁用状态
  LOCKED = 2, //锁定状态
  EXPIRED = 3, //过期状态
  FORBIDDEN = 4, //禁止登录状态
  UNREGISTER = 5, //未注册状态
  OTHER = 6, //其他状态
}

/**
 * 操作类型
 */
export interface SysUserOperationRequest {
  id?: ModeIdType
  nickName: string // 用户昵称
  leaderName: string
  userStatus: UserStatusEnums // 用户状态
  deptId: ModeIdType
  postId: ModeIdType
  profile: UserProfilesCreateRequest // 用户信息
  dept: SysDeptResponse
  post: SysDeptPostResponse
  [key: string]: any
}

export interface UserProfilesCreateRequest {
  realName: string //真实姓名
  idCardNumber: string //身份证号
  gender: number //性别
  birthDate: any //出生日期
  age: number //年龄
  address: string //地址
  postalCode: string //邮政编码
}

/**
 * 查询请求类型
 */
export interface SysUserQueryRequest extends PageQueryRequest {
  userName?: string // 用户名
  userStatus?: UserStatusEnums // 用户状态
  nickName?: string //  用户昵称
  realName?: string // 真实姓名
  idCardNumber?: string // 身份证号码
  gender?: string // 性别
  birthDate?: string[] // 生日开始时间
  birthDateStart?: string // 生日开始时间
  birthDateEnd?: string // 生日结束时间
  ageStart?: number // 年龄
  ageEnd?: number // 年龄
  postalCode?: string // 邮政编码
  deptId?: ModeIdType // 部门ID
}

/**
 * 响应类型
 */
export interface SysUserProfileResponse extends BasicResponse {
  id: ModeIdType //信息ID
  realName: string //真实姓名
  idCardNumber: string //身份证号
  gender: number //性别
  birthDate: Date //出生日期
  age: number //年龄
  address: string //地址
  postalCode: string //邮政编码
}

/**
 * 响应类型
 */
export interface SysUserResponse extends BasicResponse {
  id: ModeIdType
  userType: any
  userAccount: string
  userName: string
  passWord: string
  passWordSalt: string
  phoneNumber: string
  avatarUrl: any
  userStatus: UserStatusEnums
  deptId: string
  postId: any
  profile: SysUserProfileResponse
  positionNature: any
  dept: SysDeptResponse
  post: SysDeptPostResponse
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
  userStatus: UserStatusEnums // 账号状态
}
