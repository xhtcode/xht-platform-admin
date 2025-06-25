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

  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string
    /** 页签标题 */
    title: string
    /** 页签路由路径 */
    path: string
    /** 页签路由完整路径 */
    fullPath: string
    /** 页签图标 */
    icon?: string
    /** 是否固定页签 */
    affix?: boolean | unknown
    /** 是否开启缓存 */
    keepAlive?: boolean | unknown
    /** 路由查询参数 */
    query?: any
  }

  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string
    /** 系统版本 */
    version: string
    /** 是否显示设置 */
    showSettings: boolean
    /** 是否显示多标签导航 */
    tagsView: boolean
    /** 是否显示侧边栏Logo */
    sidebarLogo: boolean
    /** 导航栏布局(left|top|mix) */
    layout: string
    /** 主题颜色 */
    themeColor: string
    /** 主题模式(dark|light) */
    theme: string
    /** 布局大小(default |large |small) */
    size: string
    /** 语言( zh-cn| en) */
    language: string
    /** 是否开启水印 */
    watermarkEnabled: boolean
    /** 水印内容 */
    watermarkContent: string
  }

  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value: string | number
    /** 文本 */
    label: string
    /** 子列表  */
    children?: OptionType[]
  }

  /**
   * 导入结果
   */
  interface ExcelResult {
    /** 状态码 */
    code: string
    /** 无效数据条数 */
    invalidCount: number
    /** 有效数据条数 */
    validCount: number
    /** 错误信息 */
    messageList: Array<string>
  }
}
export {}
