import type { SysAreaOperationRequest, SysAreaResponse } from '@/service/model/system/area.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 系统管理-行政区划 增改页面 表单类型 默认值
 */
export const sysAreaOperationForm: SysAreaOperationRequest = {
  areaSort: 0,
}

/**
 * 系统管理-行政区划 增改页面 表单类型 表单校验
 */
export const sysAreaOperationRules: FormRules<Required<SysAreaOperationRequest>> = {
  areaCode: [{ required: true, message: '请输入区划编码', trigger: ['blur', 'change'] }],
  areaName: [{ required: true, message: '请输入区划名称', trigger: ['blur', 'change'] }],
  areaLongitude: [{ required: true, message: '请输入经度', trigger: ['blur', 'change'] }],
  areaLatitude: [{ required: true, message: '请输入纬度', trigger: ['blur', 'change'] }],
  areaSort: [{ required: true, message: '请输入排序', trigger: ['blur', 'change'] }],
}

/**
 * 系统管理-行政区划 列表显示配置
 */
export const sysAreaColumnOption: ColumnConfig<SysAreaResponse> = {
  parentId: { desc: '上级', visible: true, disabled: true },
  areaCode: { desc: '区划编码', visible: true, disabled: true },
  areaName: { desc: '区划名称', visible: true, disabled: true },
  areaPostCode: { desc: '邮政编码', visible: true, disabled: true },
  areaLongitude: { desc: '经度', visible: true, disabled: true },
  areaLatitude: { desc: '纬度', visible: true, disabled: true },
  areaSort: { desc: '排序', visible: true, disabled: true },
  hasChild: { desc: '是否存在下级', visible: true, disabled: true },
}
