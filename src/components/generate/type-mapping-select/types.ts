import type { SelectProps } from 'element-plus'
import type { ModeIdType } from '@/service/model/base.model'
import type { GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

/**
 * 数据源组件状态
 */
export interface TypeMappingSelectState {
  /**
   * 数据源列表
   */
  tableList: GenTypeMappingResponse[]

  /**
   * 加载状态
   */
  loading: boolean
}

/**
 * 数据源选择框组件属性
 */
export interface TypeMappingSelectProps extends Partial<SelectProps> {
  /**
   * 数据源ID
   */
  modelValue?: ModeIdType
  /**
   * 数据库类型（MySQL/Oracle）
   */
  dbType: DataBaseTypeEnums
  /**
   * 语言类型
   */
  languageType?: LanguageTypeEnums
}
