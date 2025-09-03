import type { TreeOptionProps } from 'element-plus'
import type { ModeIdType } from '@/model/base.model'
import type { GenTemplateGroupResponse } from '@/model/generate/template.group.model.ts'

/**
 * 数据源组件状态
 */
export interface GenTemplateGroupSelectState {
  /**
   * 数据源列表
   */
  tableList: GenTemplateGroupResponse[]

  /**
   * 加载状态
   */
  loading: boolean
}

/**
 * 数据源选择框组件属性
 */
export interface GenTemplateGroupSelectProps extends Partial<TreeOptionProps> {
}
