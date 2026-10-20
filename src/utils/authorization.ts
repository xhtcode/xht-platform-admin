/**
 * 权限判定工具
 *
 * 指令（v-authorization）与组件（xht-authorization）共用同一套判定规则，
 * 避免两处实现出现计数方式不一致的问题。
 */

/**
 * 权限来源
 * - role：仅比对角色编码
 * - button：仅比对菜单按钮编码
 * - both：两个来源取并集
 */
export type AuthorizationScope = 'role' | 'button' | 'both'

/**
 * 判定模式
 * - all：需包含全部权限（默认）
 * - any：包含任意一个即可
 * - none：不包含任何权限时通过
 */
export type AuthorizationMode = 'all' | 'any' | 'none'

/**
 * 权限判定参数
 */
export interface AuthorizationOptions {
  /** 需要的权限编码，字符串会被归一化为单元素数组 */
  required?: string | string[] | null
  /** 当前用户角色编码 */
  roleCodes?: string[] | null
  /** 当前用户菜单按钮编码 */
  buttonCodes?: string[] | null
  /** 权限来源，默认 both */
  scope?: AuthorizationScope
  /** 判定模式，默认 all */
  mode?: AuthorizationMode
  /** 超级管理员直接放行 */
  isAdmin?: boolean
}

/**
 * 归一化权限编码
 * @param required 原始权限声明
 * @returns 去空后的权限编码数组
 */
const normalizePermissions = (required?: string | string[] | null): string[] => {
  if (!required) {
    return []
  }
  const permissions = Array.isArray(required) ? required : [required]
  return permissions.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

/**
 * 判断当前用户是否满足权限要求
 *
 * 采用并集判定：先把角色编码与按钮编码合并为已授权集合，再按模式比对，
 * 因此同一编码同时出现在两个集合中不会造成重复计数。
 *
 * @param options 判定参数
 * @returns 是否通过判定
 */
export const isAuthorized = ({ required, roleCodes, buttonCodes, scope = 'both', mode = 'all', isAdmin = false }: AuthorizationOptions): boolean => {
  if (isAdmin) {
    return true
  }

  const permissions = normalizePermissions(required)
  // 未声明权限要求时：all / none 视为通过，any 视为不通过
  if (permissions.length === 0) {
    return mode !== 'any'
  }

  const granted = new Set<string>()
  if (scope !== 'button') {
    roleCodes?.forEach((code) => code && granted.add(code))
  }
  if (scope !== 'role') {
    buttonCodes?.forEach((code) => code && granted.add(code))
  }

  switch (mode) {
    case 'any':
      return permissions.some((code) => granted.has(code))
    case 'none':
      return !permissions.some((code) => granted.has(code))
    case 'all':
    default:
      return permissions.every((code) => granted.has(code))
  }
}
