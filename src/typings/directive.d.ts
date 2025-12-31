import type { Directive } from 'vue'

declare global {
  export type VPermissionModifiers = 'role' | 'button' // 指令修饰符 role 角色 button 按钮
  export type VPermissionArgs = 'all' | 'any' | 'none' // 指令参数 all 全部包含(默认) any：包含任意一个 none： 不包含
  export type VPermissionDirectives = Directive<HTMLElement, string[], VPermissionModifiers, VPermissionArgs>
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    vPermission: VPermissionDirectives
  }

  export interface ComponentCustomDirectives {
    vPermission: VPermissionDirectives
  }
}

export {}
