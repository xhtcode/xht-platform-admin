import type { TableInstance } from 'element-plus'

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
