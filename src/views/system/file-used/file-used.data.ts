import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysFileUsedOperationRequest, SysFileUsedResponse } from '@/service/model/system/file-used.model'
import { fileUsedEnabledEnum } from '@/service/enums/system/file-used.enum.ts'

/**
 * 文件用途表单初始值
 *
 * 默认启用、排序从 1 起，管理员按需调整。
 */
export const sysFileUsedOperationForm: SysFileUsedOperationRequest = {
  id: '',
  usedCode: '',
  usedName: '',
  usedDesc: '',
  usedEnabled: fileUsedEnabledEnum.ENABLED.value,
  usedSort: 1,
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
  usedDesc: [{ max: 200, message: '用途说明长度不能超过 200 个字符', trigger: 'blur' }],
  usedEnabled: [{ required: true, message: '请选择用途状态', trigger: 'blur' }],
  usedSort: [{ required: true, message: '请输入用途排序值', trigger: 'blur' }],
}

/**
 * 文件用途列表显示配置
 */
export const sysFileUsedColumnOption: ColumnConfig<SysFileUsedResponse> = {
  usedCode: { desc: '用途编码', visible: true, disabled: true },
  usedName: { desc: '用途名称', visible: true, disabled: true },
  usedEnabled: { desc: '用途状态', visible: true, disabled: false },
  usedSort: { desc: '用途排序', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: true, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: true, disabled: false },
}
