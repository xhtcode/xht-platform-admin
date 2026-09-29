import type { SysAreaOperationRequest } from '@/service/model/system/area.model'
import type { FormRules } from 'element-plus'

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
