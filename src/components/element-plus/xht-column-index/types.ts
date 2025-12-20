/**
 * 表格序号列配置属性接口
 */
export interface XhtColumnIndexProps {
  /**
   * 列宽度
   */
  width?: string | number
  /**
   * 列标题
   */
  label?: string
  /**
   * 序号类型：'step' 表示按步长计算序号,'page' 表示按页面计算序号
   */
  type?: 'step' | 'page'

  /**
   * 当前页码，用于计算序号
   */
  current?: number

  /**
   * 每页条数，用于计算序号
   */
  size?: number
}
