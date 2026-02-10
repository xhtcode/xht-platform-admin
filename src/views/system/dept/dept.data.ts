import type { SysDeptOperationRequest, SysDeptResponse } from '@/service/model/system/dept.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { deptStatusEnums } from '@/service/enums/system/dept.enum'

/**
 * 增改页面 表单类型 默认值
 */
export const sysDeptOperationForm: Partial<SysDeptOperationRequest> = {
  parentId: '0', // 父部门ID
  deptStatus: deptStatusEnums.NORMAL.value, // 部门状态,可用值:0,1
  deptSort: 0, // 显示顺序
}

/**
 * 增改页面 表单类型 表单校验
 */
export const sysDeptOperationRules: FormRules<Required<SysDeptOperationRequest>> = {
  parentId: [{ required: true, message: '请选择上级部门', trigger: ['blur', 'change'] }],
  deptCode: [{ required: true, message: '请输入部门编码', trigger: ['blur', 'change'] }], // 部门编码
  deptName: [{ required: true, message: '请输入部门名称', trigger: ['blur', 'change'] }], // 部门名称
  deptStatus: [{ required: true, message: '请输入部门状态', trigger: ['blur', 'change'] }], // 部门状态,可用值:0,1
  deptSort: [{ required: true, message: '请输入部门显示顺序', trigger: ['blur', 'change'] }], // 显示顺序
  phone: [{ required: true, message: '请输入部门联系电话', trigger: ['blur', 'change'] }], //联系电话
  email: [{ required: true, message: '请输入部门联系邮箱', trigger: ['blur', 'change'] }], //邮箱
}
/**
 * 列表显示配置
 */
export const sysDeptColumnOption: ColumnConfig<SysDeptResponse> = {
  deptName: {
    desc: '部门名称',
    visible: true,
    disabled: true,
  },
  leaderName: { desc: '部门主管', visible: true, disabled: true },
  phone: { desc: '联系电话', visible: true, disabled: true },
  email: { desc: '联系邮箱', visible: false, disabled: false },
  deptStatus: { desc: '部门状态', visible: true, disabled: false },
  deptSort: { desc: '显示顺序', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
