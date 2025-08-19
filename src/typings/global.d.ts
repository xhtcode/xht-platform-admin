declare global {
  /**
   * 常用的key和value
   */
  interface CommonKeyValue<KEY, VALUE> {
    label: KEY
    value: VALUE
  }

  /**
   * 常用value
   */
  interface CommonObjValue<VALUE> {
    [index: string]: VALUE
  }
}
export {}
