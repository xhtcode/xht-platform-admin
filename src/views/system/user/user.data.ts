import type { SysUserOperationRequest } from '@/model/system/user.model'
import { UserStatusEnums } from '@/model/system/user.model'
import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysUserOperationForm: SysUserOperationRequest = {
  nickName: '', //用户昵称
  deptId: null,
  postId: null,
  userStatus: UserStatusEnums.NORMAL, //用户状态
  profile: {
    realName: '', //真实姓名
    idCardNumber: '', //身份证号
    gender: 1, //性别1-男，2-女，3-其他
    birthDate: '2000-01-01', //出生日期
    age: 25, //年龄
    address: '', //地址
    postalCode: '', //邮政编码
  },
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysUserOperationRules: FormRules = {
  nickName: [{ required: true, message: '请输入用户昵称', trigger: ['blur', 'change'] }],
  userStatus: [{ required: true, message: '请选择用户状态', trigger: ['blur', 'change'] }],
  deptId: [{ required: true, message: '请选择部门信息', trigger: ['blur'] }],
  postId: [{ required: true, message: '请选择部门岗位信息', trigger: ['blur'] }],
  'profile.realName': [{ required: true, message: '请输入真实姓名', trigger: ['blur', 'change'] }],
  'profile.idCardNumber': [
    {
      required: true,
      message: '请输入身份证号',
      trigger: ['blur', 'change'],
    },
  ],
  'profile.gender': [{ required: true, message: '请选择性别', trigger: ['blur', 'change'] }],
  'profile.birthDate': [{ required: true, message: '请选择出生日期', trigger: ['blur', 'change'] }],
  'profile.age': [{ required: true, message: '请输入年龄', trigger: ['blur', 'change'] }],
  'profile.address': [{ required: true, message: '请输入地址', trigger: ['blur', 'change'] }],
  'profile.postalCode': [
    {
      required: true,
      message: '请输入邮政编码',
      trigger: ['blur', 'change'],
    },
  ],
  'profile.id': [{ required: true, message: '请输入用户ID', trigger: ['blur', 'change'] }],
}

/**
 * 列表显示配置
 */
export const SysUserColumnOption: ColumnOption[] = []
