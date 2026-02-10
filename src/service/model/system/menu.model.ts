/**
 * 菜单状态
 */
export type MenuStatus = 0 | 1
/**
 * 菜单类型
 */
export type MenuType = 'M' | 'C' | 'B'
/**
 * 菜单公共属性
 */
export type MenuCommon = 0 | 1

/**
 * 菜单查询请求类型
 */
export interface SysMenuQueryRequest extends PageQueryRequest {
  menuType?: MenuType // 菜单类型
  menuName?: string // 菜单名称
  menuStatus?: MenuStatus // 菜单状态
}

/**
 * 菜单响应类型
 */
export interface SysMenuResponse extends MetaResponse {
  id: ModeIdType // 菜单ID
  parentId: ModeIdType // 父菜单ID
  menuType?: MenuType // 类型
  menuName?: string // 菜单名称
  menuIcon?: string // 菜单图标
  menuPath?: string // 路由地址
  menuHidden?: MenuCommon // 显示状态 (0显示 1隐藏)
  menuCache?: MenuCommon // 是否缓存 （0是 1否）
  menuStatus?: MenuStatus // 菜单状态 （0正常 1停用）
  menuAuthority?: string // 菜单权限字符串
  menuSort?: number // 菜单排序
  viewName?: string // 组件视图名称
  viewPath?: string // 组件视图路径
  frameFlag?: MenuCommon // 是否为外链
  affixStatus?: number // 菜单固定状态
}

/**
 * 菜单操作类型
 */
export interface SysMenuOperationRequest extends Partial<SysMenuResponse>, BasicFormRequest {
  activeMenuPath?: string // 高亮菜单
}
