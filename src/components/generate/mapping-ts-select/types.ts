import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import type { GenTypeMappingResponse } from '@/service/model/generate/type.mapping.model'

/**
 * 数据源选择框组件属性
 */
export interface MappingTsSelectProps {
  dataBaseType: DataBaseTypeEnums // 数据库类型
  dbDataType: string // 字段数据库类型
  placeholder?: string // 占位符
  clearable?: boolean // 是否禁用
  disabled?: boolean // 是否禁用
  loadingStatus?: boolean // 加载状态
}

/**
 * 数据源选择框组件状态
 */
export interface MappingTsSelectState {
  selectId: ModeIdType // 字段类型id
  tableList: GenTypeMappingResponse[] // 表格数据
  loadingStatus: boolean // 加载状态
}
