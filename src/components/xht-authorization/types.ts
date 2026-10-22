/**
 * 权限包裹组件 props 属性
 */
export interface XhtAuthorizationProps {
  authorization: string | string[] // 权限标识（角色编码 / 按钮编码）
  modifiers?: VAuthorizationModifiers // 权限范围修饰符
  args?: VAuthorizationArgs // 多权限时的匹配模式
}
