import type { App } from 'vue'
import { vPermission } from '@/directives/auth-directive'

/**
 * 注册所有的指令
 */
export function setupDirectives(Vue: App<Element>) {
  Vue.directive('permission', vPermission)
}
