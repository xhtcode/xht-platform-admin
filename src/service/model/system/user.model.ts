import type { SysDeptPostResponse } from '@/service/model/system/dept.post.model'

/**
 * 用户类型枚举（对应 Java 的 UserTypeEnums）
 */
export enum UserTypeEnums {
  // 枚举成员（对应 Java 中的枚举实例）
  ADMIN = 1,
  BUSINESS = 2,
  USER = 3,
}

/**
 * 用户账号状态枚举
 */
export enum UserStatusEnums {
  /**
   * 正常状态
   * <ul>
   *   <li>核心语义：账号完全可用</li>
   *   <li>触发场景示例：用户完成注册 + 激活，无任何限制</li>
   *   <li>账号可用性：完全可用</li>
   *   <li>对应业务动作：允许登录、使用所有功能</li>
   * </ul>
   */
  NORMAL = 0,

  /**
   * 未激活状态
   * <ul>
   *   <li>核心语义：账号已创建但未完成验证</li>
   *   <li>触发场景示例：用户注册后未验证手机号 / 邮箱，或新账号未启用</li>
   *   <li>账号可用性：不可用（未生效）</li>
   *   <li>对应业务动作：提示用户完成验证，验证后转为 “正常”</li>
   * </ul>
   */
  UNACTIVATED = 1,

  /**
   * 禁用状态
   * <ul>
   *   <li>核心语义：管理员手动限制账号使用</li>
   *   <li>触发场景示例：违规操作、账号异常（需人工干预）</li>
   *   <li>账号可用性：不可用（可恢复）</li>
   *   <li>对应业务动作：管理员手动解除禁用后转为 “正常”</li>
   * </ul>
   */
  DISABLED = 2,

  /**
   * 锁定状态
   * <ul>
   *   <li>核心语义：安全策略触发的临时限制</li>
   *   <li>触发场景示例：密码连续输错 3 次、异地登录触发安全校验</li>
   *   <li>账号可用性：不可用（临时）</li>
   *   <li>对应业务动作：超时自动解锁，或用户验证后解锁</li>
   * </ul>
   */
  LOCKED = 3,

  /**
   * 过期状态
   * <ul>
   *   <li>核心语义：账号有效期已结束</li>
   *   <li>触发场景示例：临时账号到期、付费会员 / 权限到期</li>
   *   <li>账号可用性：不可用（需续期）</li>
   *   <li>对应业务动作：用户续费 / 延长有效期后转为 “正常”</li>
   * </ul>
   */
  EXPIRED = 4,
}

/**
 * 用户状态描述映射的类型定义：
 * 键为 UserStatusEnums 的所有枚举值，值为对应的状态描述字符串
 */
export type UserStatusDescType = Record<UserStatusEnums, string>

/**
 * 用户状态描述映射（用于快速获取状态文本）
 */
export const UserStatusDesc: UserStatusDescType = {
  [UserStatusEnums.NORMAL]: '正常',
  [UserStatusEnums.UNACTIVATED]: '未激活',
  [UserStatusEnums.DISABLED]: '禁用',
  [UserStatusEnums.LOCKED]: '锁定',
  [UserStatusEnums.EXPIRED]: '过期',
}

/**
 * 状态颜色映射的类型定义（与UserStatusDescType保持一致的结构）
 */
export type UserStatusColorType = Record<UserStatusEnums, string>

/**
 * 用户状态对应的颜色映射（与switch逻辑完全对应）
 */
export const UserStatusColor: UserStatusColorType = {
  [UserStatusEnums.NORMAL]: '#67C23A', // 官方Success色：正常可用
  [UserStatusEnums.UNACTIVATED]: '#909399', // 官方Secondary Text色：未生效（中性）
  [UserStatusEnums.DISABLED]: '#F56C6C', // 官方Danger色：人工禁用（强限制）
  [UserStatusEnums.LOCKED]: '#E6A23C', // 官方Warning色：临时锁定（需注意）
  [UserStatusEnums.EXPIRED]: '#F56C6C', // 官方Danger色：过期不可用（需操作）
}

/**
 * 查询请求类型
 */
export interface SysUserQueryRequest extends PageQueryRequest {
  userType?: UserTypeEnums // 用户类型
  userName?: string // 用户账号
  nickName?: string // 用户昵称
  userStatus?: UserStatusEnums // 账号状态
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
  userType: UserTypeEnums // 用户类型
  userName: string // 用户名
  nickName: string // 用户昵称
  userStatus: UserStatusEnums // 用户状态
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
  userStatus: UserStatusEnums // 账号状态
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
