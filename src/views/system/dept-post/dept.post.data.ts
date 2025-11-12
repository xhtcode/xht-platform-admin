import type {
  SysDeptPostOperationRequest,
  SysDeptPostResponse,
} from '@/service/model/system/dept.post.model'
import { SysDeptPostStatusEnums } from '@/service/model/system/dept.post.model'
import type { FormRules } from 'element-plus'
import { ColumnConfig } from '@/components/table-tool-bar/types'

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
export const SysDeptPostColumnOption: ColumnConfig<SysDeptPostResponse> = {
  postCode: { desc: '岗位编码', visible: true, disabled: true },
  postName: { desc: '岗位名称', visible: true, disabled: true },
  postLimit: { desc: '员工统计', visible: false, disabled: false },
  postStatus: { desc: '岗位状态', visible: true, disabled: false },
  systemFlag: { desc: '系统内置', visible: false, disabled: false },
  postSort: { desc: '岗位排序', visible: true, disabled: false },
  remark: { desc: '岗位描述', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: {
    desc: '创建时间',
    visible: false,
    disabled: false,
  },
  updateBy: {
    desc: '更新人',
    visible: false,
    disabled: false,
  },
  updateTime: {
    desc: '更新时间',
    visible: false,
    disabled: false,
  },
}
