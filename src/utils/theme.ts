const rootStyle = document.documentElement.style
/**
 * 修改 CSS 属性
 * @param key 属性key
 * @param value 属性值
 */
export const changeCssProperty = (key: string, value: string) => {
  rootStyle.setProperty(key, value)
}
