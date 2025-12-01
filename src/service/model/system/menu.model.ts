import type { BasicResponse, BasicFormRequest, INodeResponse, ModeIdType, PageQueryRequest } from '@/service/model/base.model'

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
 * 显示状态枚举
 */
export enum MenuHiddenEnums {
  SHOW = 0, // 显示
  HIDE = 1, // 隐藏
}

/**
 * 是否缓存枚举
 */
export enum MenuCacheEnums {
  YES = 0, // 是
  NO = 1, // 否
}

/**
 * 菜单外联链枚举
 */
export enum MenuLinkEnums {
  YES = 0, // 是
  NO = 1, // 否
}

/**
 * 菜单操作类型
 */
export interface SysMenuOperationRequest extends BasicFormRequest {
  id: ModeIdType // 菜单ID
  parentId: ModeIdType // 父菜单ID
  menuType?: MenuTypeEnums // 类型
  menuName?: string // 菜单名称
  menuIcon?: string // 菜单图标
  menuPath?: string // 路由地址
  activeMenuPath?: string // 高亮菜单
  menuHidden?: MenuHiddenEnums // 显示状态 (0显示 1隐藏)
  menuCache?: MenuCacheEnums // 是否缓存 （0是 1否）
  menuStatus?: MenuStatusEnums // 菜单状态 （0正常 1停用）
  menuAuthority?: string // 菜单权限字符串
  menuSort?: number // 菜单排序
  viewName?: string // 组件视图名称
  viewPath?: string // 组件视图路径
  frameFlag?: MenuLinkEnums // 是否为外链
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
  menuHidden?: MenuHiddenEnums // 显示状态 (0显示 1隐藏)
  menuCache?: MenuCacheEnums // 是否缓存 （0是 1否）
  menuStatus?: MenuStatusEnums // 菜单状态 （0正常 1停用）
  menuAuthority?: string // 菜单权限字符串
  menuSort?: number // 菜单排序
  viewName?: string // 组件视图名称
  viewPath?: string // 组件视图路径
  frameFlag?: MenuLinkEnums // 是否为外链
}

/**
 * 菜单树响应类型
 */
export type SysMenuTreeResponse = INodeResponse<SysMenuResponse>[]
