import type { SelectProps } from 'element-plus'
import type { ModeIdType } from '@/model/base.model'
import type { GenDataSourceResponse } from '@/model/generate/datasource.model'

/**
 * 数据源组件状态
 */
export interface DataSourceSelectState {
  /**
   * 数据源列表
   */
  tableList: GenDataSourceResponse[]

  /**
   * 加载状态
   */
  loading: boolean
}

/**
 * 数据源选择框组件属性
 */
export interface DataSourceSelectProps extends Partial<SelectProps> {
  /**
   * 数据源ID
   */
  modelValue?: ModeIdType
}
