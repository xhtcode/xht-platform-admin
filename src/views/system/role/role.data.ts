import type { SysRoleOperationRequest, SysRoleResponse } from '@/service/model/system/role.model'
import { RoleStatusEnums } from '@/service/model/system/role.model'
import type { FormRules } from 'element-plus'
import { ColumnConfig, ColumnOption } from '@/components/table-tool-bar/types'
import type { SysDictResponse } from '@/service/model/system/dict.model'

/**
 * 增改页面 表单类型 默认值
 */
export const SysRoleOperationForm: SysRoleOperationRequest = {
  id: 0, // 角色ID
  roleCode: '', //角色编码
  roleName: '', //角色名称
  remark: '暂无', //角色描述
  dataScope: 0, //数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5本岗位数据权限  6仅本人数据权限）
  roleStatus: RoleStatusEnums.NORMAL, //状态（0正常 1停用）,可用值:0,1
  roleSort: 0, //显示顺序
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysRoleOperationRules: FormRules = {
  roleCode: [{ required: true, message: '请输入角色编码', trigger: ['blur', 'change'] }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
  roleSort: [{ required: true, message: '请输入显示顺序', trigger: ['blur', 'change'] }],
  roleStatus: [{ required: true, message: '请选择状态', trigger: ['blur', 'change'] }],
  dataScope: [{ required: true, message: '请选择数据范围', trigger: ['blur', 'change'] }],
  remark: [{ required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }],
}

/**
 * 列表显示配置
 */
export const SysRoleColumnOption: ColumnConfig<SysRoleResponse> = {
  createBy: {
    desc: '创建人',
    visible: true,
    disabled: false,
  },
  createTime: {
    desc: '创建时间',
    visible: true,
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
