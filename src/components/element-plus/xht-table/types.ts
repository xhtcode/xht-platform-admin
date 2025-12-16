import type { TableInstance, TableProps } from 'element-plus'
import { DefaultRow, TreeProps } from 'element-plus/es/components/table/src/table/defaults'

/**
 * 表格组件属性接口，继承自 Element Plus 的 TableProps
 * @template T 继承自 BasicResponse 的泛型类型，用于定义表格数据项的类型
 */
export interface XhtTableProps<T extends DefaultRow> {
  data: T[] // 表数据
  border?: boolean // 是否带有纵向边框，默认false
  rowKey?: string | ((row: T) => string) // 行数据的 Key，
  className?: string // 表格样式类名
  fit?: boolean // 列的宽度是否自撑开，默认true
  selectOnIndeterminate?: boolean // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行，默认true
  cellStyle?: Partial<TableProps<T>['cellStyle']>
  headerCellStyle?: Partial<TableProps<T>['headerCellStyle']>
  emptyText?: string // 空数据时显示的文本内容
  treeProps?: TreeProps | null // 树形结构配置项
  defaultExpandAll?: boolean // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效，默认false
  showHeader?: boolean // 是否显示表头，默认true
  showSummary?: boolean // 是否在表尾显示合计行，默认false
  highlightCurrentRow?: boolean // 是否要高亮当前行，默认false
}

/**
 * 表格组件 emits 属性
 */
export interface XhtTablePropsEmits<T extends DefaultRow> {
  /**
   * 当选择项发生变化时会触发该事件
   */
  (e: 'selectionChange', selection: T[]): void
}

/**
 * 列拖拽排序组件属性接口
 */
export interface XhtColumnDragSortProps {
  label?: string
  /**
   * 列宽度
   */
  width?: string | number
  /**
   * 表格实例对象，用于获取和操作表格实例
   */
  tableRef?: TableInstance | null
}

/**
 * 列拖拽排序组件事件发射接口
 */
export interface XhtColumnDragSortEmits {
  /**
   * 拖拽结束事件
   * @param e 事件名称 'dragEnd'
   * @param oldIndex 原始位置索引
   * @param newIndex 新位置索引
   */
  (e: 'dragEnd', oldIndex: number, newIndex: number): void
}

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
