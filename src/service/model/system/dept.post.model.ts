import type { BasicResponse, ModeIdType, PageQueryRequest, SystemFlagEnums } from '@/service/model/base.model'

/**
 * 部门状态
 */
export enum SysDeptPostStatusEnums {
  /**
   * 启用
   */
  NORMAL = 0,
  /**
   * 禁用
   */
  DISABLE = 1,
}

/**
 * 操作类型
 */
export interface SysDeptPostOperationRequest {
  id: ModeIdType // 岗位id
  deptId: ModeIdType //  部门id
  postCode: string //  岗位编码
  postName: string // 岗位名称
  postSort: number // 岗位排序
  postLimit: number // 岗位人员限制
  postHave?: number // 岗位已分配人员
  remark: string // 岗位描述
  postStatus: SysDeptPostStatusEnums // 岗位状态
  systemFlag?: SystemFlagEnums // 系统内置
}

/**
 * 查询请求类型
 */
export interface SysDeptPostQueryRequest extends PageQueryRequest {
  deptId?: ModeIdType //  部门id
  postCode?: string //  岗位编码
  postName?: string // 岗位名称
  postStatus?: SysDeptPostStatusEnums // 岗位状态
  systemFlag?: SystemFlagEnums // 系统内置
}

/**
 * 响应类型
 */
export interface SysDeptPostResponse extends BasicResponse {
  id: ModeIdType // 岗位id
  deptId: ModeIdType //  部门id
  postCode: string //  岗位编码
  postName: string // 岗位名称
  postSort: number // 岗位排序
  postHave: number // 岗位人员已有人数
  postLimit: number // 岗位人员限制
  remark: string // 岗位描述
  postStatus: SysDeptPostStatusEnums // 岗位状态
  systemFlag: SystemFlagEnums // 系统内置
}
