import type { BasicFormRequest, BasicResponse, INodeResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'

/**
 * 定义菜单状态枚举类型
 */
export enum MenuStatusEnums {
  NORMAL = 0, // 激活
  DISABLE = 1, // 停用
}

/**
 * 菜单类型枚举
 */
export enum MenuTypeEnums {
  M = 'M', //目录
  C = 'C', //菜单
  B = 'B', //按钮
}

/**
 * 菜单公共属性
 */
export enum MenuCommonStatus {
  NO = 0, // 否
  YES = 1, // 是
}

/**
 * 菜单查询请求类型
 */
export interface SysMenuQueryRequest extends PageQueryRequest {
  menuType?: MenuTypeEnums // 菜单类型
  menuName?: string // 菜单名称
  menuStatus?: MenuStatusEnums // 菜单状态
}

/**
 * 菜单响应类型
 */
export interface SysMenuResponse extends BasicResponse {
  id: ModeIdType // 菜单ID
  parentId: ModeIdType // 父菜单ID
  menuType?: MenuTypeEnums // 类型
  menuName?: string // 菜单名称
  menuIcon?: string // 菜单图标
  menuPath?: string // 路由地址
  menuHidden?: MenuCommonStatus // 显示状态 (0显示 1隐藏)
  menuCache?: MenuCommonStatus // 是否缓存 （0是 1否）
  menuStatus?: MenuStatusEnums // 菜单状态 （0正常 1停用）
  menuAuthority?: string // 菜单权限字符串
  menuSort?: number // 菜单排序
  viewName?: string // 组件视图名称
  viewPath?: string // 组件视图路径
  frameFlag?: MenuCommonStatus // 是否为外链
  affixStatus?: MenuCommonStatus // 菜单固定状态
}

/**
 * 菜单树响应类型
 */
export type SysMenuTreeResponse = INodeResponse<SysMenuResponse>[]

/**
 * 菜单操作类型
 */
export interface SysMenuOperationRequest extends Partial<SysMenuResponse>, BasicFormRequest {
  activeMenuPath?: string // 高亮菜单
}
