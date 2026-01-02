import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

/**
 * 角色权限指令
 * @param el DOM元素
 * @param binding 绑定对象
 */
export const vPermission: VAuthorizationDirectives = (el, binding) => {
  const checkPermission = binding.value || []
  const args = binding.arg || 'all'
  const permissions = useUserInfoStore()
  const { userInfo, isAdmin } = storeToRefs(permissions)
  if (isAdmin.value) {
    return
  }
  let intersection: number = 0
  if (binding.modifiers.role || binding.modifiers.button) {
    if (binding.modifiers.role) {
      intersection += getIntersectionLength(userInfo.value.roleCodes, checkPermission)
    }
    if (binding.modifiers.button) {
      intersection += getIntersectionLength(userInfo.value.menuButtonCodes, checkPermission)
    }
  } else {
    intersection += getIntersectionLength(userInfo.value.roleCodes, checkPermission)
    intersection += getIntersectionLength(userInfo.value.menuButtonCodes, checkPermission)
  }
  switch (args) {
    case 'all': // 包含所有
      if (intersection !== checkPermission.length) {
        el.parentNode?.removeChild(el)
      }
      break
    case 'any': // 包含任意一个以上
      if (intersection <= 0) {
        el.parentNode?.removeChild(el)
      }
      break
    case 'none': // 不包含任意一个
      if (intersection > 0) {
        el.parentNode?.removeChild(el)
      }
      break
  }
}

/**
 * 获取交集长度
 * @param dataArray
 * @param checkArray
 */
function getIntersectionLength(dataArray: string[], checkArray: string[]): number {
  return _.intersection(dataArray, checkArray)?.length || 0
}
