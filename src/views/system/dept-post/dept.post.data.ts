import type { SysDeptPostOperationRequest } from '@/service/model/system/dept.post.model'
import { SysDeptPostStatusEnums } from '@/service/model/system/dept.post.model'
import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysDeptPostOperationForm: SysDeptPostOperationRequest = {
  id: null, // 岗位id
  deptId: null, //  部门id
  postCode: '', //  岗位编码
  postName: '', // 岗位名称
  postSort: 0, // 岗位排序
  postStatus: SysDeptPostStatusEnums.NORMAL, //  岗位状态
  postLimit: 999, // 岗位人员限制
  remark: '暂无', // 岗位描述
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysDeptPostOperationRules: FormRules = {
  deptId: [{ required: true, message: '请选择所属部门', trigger: ['blur', 'change'] }],
  postCode: [{ required: true, message: '请输入岗位编码', trigger: ['blur', 'change'] }],
  postName: [{ required: true, message: '请输入岗位名称', trigger: ['blur', 'change'] }],
  postSort: [{ required: true, message: '请输入岗位排序', trigger: ['blur', 'change'] }],
  postStatus: [{ required: true, message: '请选择岗位状态', trigger: ['blur', 'change'] }],
  remark: [{ required: true, message: '请输入岗位描述', trigger: ['blur', 'change'] }],
}

/**
 * 列表显示配置
 */
export const SysDeptPostColumnOption: ColumnOption[] = []
