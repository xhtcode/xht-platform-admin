import type { _RouteLocationBase } from 'vue-router'
import type { MenuTypeEnums } from '@/model/system/menu.model'

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    title?: string //菜单名称
    icon?: string //图标
    activeMenuPath?: string //菜单点击地址
    linkStatus?: boolean //是否外链
    hiddenStatus?: boolean //是否隐藏 true 隐藏
    fullStatus?: boolean //是否全屏（true）
    affixStatus?: boolean //tags固定
    keepAliveStatus?: boolean //是否缓存
    backstage?: boolean // 标识此路由为后端返回路由
    rank?: number // 路由排序
    menuType?: MenuTypeEnums // 菜单类型
    roles?: string[] //权限标识
    [index: string]: any
  }

  interface RouteLocationNormalizedLoaded extends _RouteLocationBase {
    children: RouteLocationNormalizedLoaded[]
  }
}

export {}
