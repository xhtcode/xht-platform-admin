import type { RouteRecordRaw } from 'vue-router'

/**
 * 菜单点击事件触发接口
 * @param e - 事件名称，固定为 'menuClick'
 * @param menuList - 点击后传递的菜单列表数据
 * @param linkStatus - 是否跳转 true 跳转 false 不跳转
 */
export interface EmitsType {
  (e: 'change', menuList: RouteRecordRaw[], linkStatus: boolean): void
}
