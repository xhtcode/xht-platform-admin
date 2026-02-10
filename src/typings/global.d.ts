declare global {
  /**
   * 字典枚举项类型
   */
  export interface DictEnumItem<T> {
    label: string
    value: T
    color?: string
    type?: 'primary' | 'success' | 'warning' | 'info' | 'danger'
    disabled?: boolean
    [key: string]: any
  }

  /**
   * 字典枚举类型
   */
  export type DictEnum<T, K extends string = string> = {
    [key in K]: DictEnumItem<T>
  }
}
export {}
