import type { SysDeptOperationRequest } from '@/service/model/system/dept.model'
import { DeptStatusEnums } from '@/service/model/system/dept.model'
import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysDeptOperationForm: SysDeptOperationRequest = {
  id: '', //部门id
  parentId: '0', // 父部门ID
  deptCode: '', // 部门编码
  deptName: '', // 部门名称
  deptStatus: DeptStatusEnums.NORMAL, // 部门状态,可用值:0,1
  deptSort: 0, // 显示顺序
  leaderUserId: null, //负责人id
  leaderName: '', //负责人姓名
  phone: '', //联系电话
  email: '', //邮箱
  remark: '', //备注
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysDeptOperationRules: FormRules = {
  parentId: [{ required: true, message: '请选择上级部门', trigger: ['blur', 'change'] }],
  deptCode: [{ required: true, message: '请输入部门编码', trigger: ['blur', 'change'] }], // 部门编码
  deptName: [{ required: true, message: '请输入部门名称', trigger: ['blur', 'change'] }], // 部门名称
  deptStatus: [{ required: true, message: '请输入部门状态', trigger: ['blur', 'change'] }], // 部门状态,可用值:0,1
  deptSort: [{ required: true, message: '请输入部门显示顺序', trigger: ['blur', 'change'] }], // 显示顺序
  phone: [{ required: true, message: '请输入部门联系电话', trigger: ['blur', 'change'] }], //联系电话
  email: [{ required: true, message: '请输入部门联系邮箱', trigger: ['blur', 'change'] }], //邮箱
  remark: [{ required: true, message: '请输入部门备注', trigger: ['blur', 'change'] }], //备注
}

/**
 * 列表显示配置
 */
export const SysDeptColumnOption: ColumnOption[] = []
