import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysFileUsedOperationRequest, SysFileUsedResponse } from '@/service/model/system/file-used.model'

/**
 * 文件用途表单初始值
 *
 * 默认按「私有 + 无特殊限制 + 无水印」起步，管理员按需收紧。
 */
export const sysFileUsedOperationForm: SysFileUsedOperationRequest = {
  usedCode: '',
  usedName: '',
  description: '',
  enabled: 1,
  sort: 1,
  accessScope: 'private',
  publicAllowed: 0,
  downloadAllowed: 1,
  printAllowed: 1,
  shareAllowed: 1,
  shareExpireDays: null,
  shareMaxAccessCount: null,
  watermarkLevel: 'off',
  imageMode: null,
}

/**
 * 文件用途表单校验规则
 */
export const sysFileUsedOperationRules: FormRules = {
  usedCode: [
    { required: true, message: '请输入用途编码', trigger: 'blur' },
    {
      pattern: /^[a-z][a-z0-9_]{1,31}$/,
      message: '编码需以小写字母开头，仅含小写字母、数字与下划线，长度 2~32',
      trigger: 'blur',
    },
  ],
  usedName: [
    { required: true, message: '请输入用途名称', trigger: 'blur' },
    { whitespace: true, message: '用途名称不能全为空格', trigger: 'blur' },
    { max: 30, message: '用途名称长度不能超过 30 个字符', trigger: 'blur' },
  ],
  description: [{ max: 200, message: '说明长度不能超过 200 个字符', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  watermarkLevel: [{ required: true, message: '请选择水印等级', trigger: 'change' }],
}

/**
 * 文件用途列表显示配置
 */
export const sysFileUsedColumnOption: ColumnConfig<SysFileUsedResponse> = {
  usedCode: { desc: '用途编码', visible: true, disabled: true },
  usedName: { desc: '用途名称', visible: true, disabled: true },
  enabled: { desc: '状态', visible: true, disabled: false },
  accessScope: { desc: '访问范围', visible: true, disabled: false },
  downloadAllowed: { desc: '可下载', visible: true, disabled: false },
  printAllowed: { desc: '可打印', visible: false, disabled: false },
  shareAllowed: { desc: '可分享', visible: true, disabled: false },
  watermarkLevel: { desc: '水印等级', visible: true, disabled: false },
  fileCount: { desc: '引用文件数', visible: true, disabled: false },
  builtIn: { desc: '内置', visible: false, disabled: false },
  sort: { desc: '排序', visible: true, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
