/**
 * 系统内置
 */
export enum SystemFlagEnums {
  /**
   * 系统内置
   */
  YES = 0,
  /**
   * 非系统内置
   */
  NO = 1,
}

/**
 * 标签值对象
 */
export interface LabelValue<K, V> {
  label: K
  value: V
}
