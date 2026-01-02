import type { Directive } from 'vue'

declare global {
  export type VAuthorizationModifiers = 'role' | 'button' // 指令修饰符 role 角色 button 按钮
  export type VAuthorizationArgs = 'all' | 'any' | 'none' // 指令参数 all 全部包含(默认) any：包含任意一个 none： 不包含
  export type VAuthorizationDirectives = Directive<HTMLElement, string[], VAuthorizationModifiers, VAuthorizationArgs>
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    VAuthorization: VAuthorizationDirectives
  }

  export interface ComponentCustomDirectives {
    VAuthorization: VAuthorizationDirectives
  }
}

export {}
