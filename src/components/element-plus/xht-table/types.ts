import type { TableInstance, TableProps } from 'element-plus'
import type { BasicResponse } from '@/service/model/base.model'

/**
 * 表格组件属性接口，继承自 Element Plus 的 TableProps
 * @template T 继承自 BasicResponse 的泛型类型，用于定义表格数据项的类型
 */
export interface XhtTableProps<T extends BasicResponse> extends Partial<TableProps<T>> {
  cellStyle?: Partial<TableProps<T>['cellStyle']>
  headerCellStyle?: Partial<TableProps<T>['headerCellStyle']>
}

/**
 * 列拖拽排序组件属性接口
 */
export interface XhtColumnDragSortProps {
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
   * @param newIndex 新位置索引
   * @param oldIndex 原始位置索引
   */
  (e: 'dragEnd', newIndex: number, oldIndex: number): void
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
