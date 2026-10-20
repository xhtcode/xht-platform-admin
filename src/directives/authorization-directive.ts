import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'
import { isAuthorized, type AuthorizationScope } from '@/utils/authorization'

/**
 * 角色权限指令
 *
 * 用法：v-authorization="['sys:user:add']"、v-authorization:any.button="['a', 'b']"
 * 判定规则由 isAuthorized 统一实现，此处只负责解析修饰符并移除无权元素。
 *
 * @param el DOM元素
 * @param binding 绑定对象
 */
export const vPermission: VAuthorizationDirectives = (el, binding) => {
  const { userInfo, isAdmin } = storeToRefs(useUserInfoStore())

  // 仅声明单个修饰符时限定权限来源，同时声明或均未声明时取两个来源的并集
  let scope: AuthorizationScope = 'both'
  if (binding.modifiers.role && !binding.modifiers.button) {
    scope = 'role'
  } else if (binding.modifiers.button && !binding.modifiers.role) {
    scope = 'button'
  }

  const authorized = isAuthorized({
    required: binding.value,
    roleCodes: userInfo.value.roleCodes,
    buttonCodes: userInfo.value.menuButtonCodes,
    scope,
    mode: binding.arg ?? 'all',
    isAdmin: isAdmin.value,
  })

  if (!authorized) {
    el.parentNode?.removeChild(el)
  }
}
