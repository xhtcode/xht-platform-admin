import type { SysRoleTypeOperationRequest, SysRoleTypeResponse } from '@/service/model/system/role-type.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { roleTypeStatusEnum } from '@/service/enums/system/role-type.enum'

/**
 * 角色类型 增改弹窗 表单默认值
 */
export const sysRoleTypeOperationForm: Partial<SysRoleTypeOperationRequest> = {
  typeStatus: roleTypeStatusEnum.NORMAL.value, // 状态（0正常 1停用）
  typeSort: 0, // 显示顺序
  remark: '', // 备注
}

/**
 * 角色类型 增改弹窗 表单校验
 */
export const sysRoleTypeOperationRules: FormRules<Required<SysRoleTypeOperationRequest>> = {
  typeCode: [{ required: true, message: '请输入类型编码', trigger: ['blur', 'change'] }],
  typeName: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }],
  typeStatus: [{ required: true, message: '请选择状态', trigger: ['blur', 'change'] }],
  typeSort: [{ required: true, message: '请输入显示顺序', trigger: ['blur', 'change'] }],
}

/**
 * 角色类型 列表显示配置
 */
export const sysRoleTypeColumnOption: ColumnConfig<SysRoleTypeResponse> = {
  typeCode: { desc: '类型编码', visible: true, disabled: false },
  typeName: { desc: '类型名称', visible: true, disabled: false },
  typeSort: { desc: '显示顺序', visible: true, disabled: false },
  typeStatus: { desc: '类型状态', visible: true, disabled: false },
  remark: { desc: '类型备注', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
