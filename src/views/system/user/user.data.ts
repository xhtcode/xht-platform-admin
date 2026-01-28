import type { SysUserOperationRequest, SysUserResponse } from '@/service/model/system/user.model'
import { UserStatusEnums, UserTypeEnums } from '@/service/model/system/user.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const sysUserOperationForm: SysUserOperationRequest = {
  userType: UserTypeEnums.USER,
  userStatus: UserStatusEnums.NORMAL,
  profile: {},
  postInfos: [],
}

/**
 * 增改页面 表单类型 表单校验
 */
export const sysUserOperationRules: FormRules<Required<SysUserOperationRequest>> = {
  userName: [
    { required: true, message: '请输入登录账号', trigger: ['blur', 'change'] },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: ['blur', 'change'] },
    { min: 2, max: 30, message: '昵称长度必须在 2-30 个字符之间', trigger: 'blur' },
  ],
  userType: [{ required: true, message: '请选择用户类型', trigger: ['blur', 'change'] }],
  userStatus: [{ required: true, message: '请选择账号状态', trigger: ['blur', 'change'] }],
  userPhone: [
    { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' },
  ],
  deptId: [{ required: true, message: '请选择所属部门', trigger: ['blur', 'change'] }],
  userAvatar: [],
  'profile.realName': [
    { required: true, message: '请输入真实姓名', trigger: ['blur', 'change'] },
    { min: 2, max: 20, message: '真实姓名长度必须在 2-20 个字符之间', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '真实姓名只能包含中文或字母', trigger: 'blur' },
  ],
  'profile.idCard': [
    { required: true, message: '请输入身份证号', trigger: ['blur', 'change'] },
    {
      pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确的18位身份证号',
      trigger: 'blur',
    },
  ],
  'profile.gender': [{ required: true, message: '请选择用户性别', trigger: ['blur', 'change'] }],
  'profile.birthDate': [{ required: true, message: '请选择出生日期', trigger: ['blur', 'change'] }],
  'profile.age': [{ required: true, message: '请输入年龄', trigger: ['blur', 'change'] }],
  'profile.emergencyContact': [
    { required: true, message: '请输入紧急联系人', trigger: ['blur', 'change'] },
    { min: 2, max: 20, message: '紧急联系人长度必须在 2-20 个字符之间', trigger: 'blur' },
  ],
  'profile.emergencyPhone': [
    { required: true, message: '请输入紧急联系人电话', trigger: ['blur', 'change'] },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的紧急联系人手机号码', trigger: 'blur' },
  ],
  'profile.nation': [
    { required: true, message: '请输入民族', trigger: ['blur', 'change'] },
    { min: 1, max: 10, message: '民族名称长度不超过10个字符', trigger: 'blur' },
  ],
  'profile.address': [
    { required: true, message: '请输入用户地址', trigger: ['blur', 'change'] },
    { min: 5, max: 200, message: '地址长度必须在 5-200 个字符之间', trigger: 'blur' },
  ],
  'profile.postalCode': [
    { required: true, message: '请输入邮政编码', trigger: ['blur', 'change'] },
    { pattern: /^\d{6}$/, message: '请输入正确的6位邮政编码', trigger: 'blur' },
  ],
}

/**
 * 列表显示配置
 */
export const sysUserColumnOption: ColumnConfig<SysUserResponse> = {
  userAvatar: {
    desc: '用户头像',
    visible: true,
    disabled: true,
  },
  userName: { desc: '用户账号', visible: true, disabled: true },
  nickName: { desc: '用户昵称', visible: true, disabled: true },
  userType: { desc: '用户类型', visible: true, disabled: false },
  userStatus: { desc: '用户状态', visible: true, disabled: false },
  userPhone: { desc: '手机号码', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
