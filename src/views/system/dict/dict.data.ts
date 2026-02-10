import type { SysDictOperationRequest, SysDictResponse } from '@/service/model/system/dict.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { sysDictStatusEnums } from '@/service/enums/system/dict.enum'

/**
 * 增改页面 表单类型 默认值
 */
export const sysDictOperationForm: Partial<SysDictOperationRequest> = {
  sortOrder: 0, //排序序号
  status: sysDictStatusEnums.ENABLED.value, //状态(1:启用 0:禁用)
}

/**
 * 增改页面 表单类型 表单校验
 */
export const sysDictOperationRules: FormRules<Required<SysDictOperationRequest>> = {
  dictCode: [
    { required: true, message: '字典编码不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '字典编码只能包含字母、数字和下划线', trigger: 'blur' },
    { max: 50, message: '字典编码长度不能超过50个字符', trigger: 'blur' },
  ],
  dictName: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' },
    { max: 50, message: '字典名称长度不能超过50个字符', trigger: 'blur' },
  ],
  sortOrder: [
    { required: true, message: '排序序号不能为空', trigger: 'blur' },
    { type: 'number', message: '排序序号必须为数字', trigger: 'blur' },
  ],
  remark: [{ max: 200, message: '字典描述长度不能超过200个字符', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
}

/**
 * 列表显示配置
 */
export const sysDictColumnOption: ColumnConfig<SysDictResponse> = {
  dictName: {
    desc: '字典名称',
    visible: true,
    disabled: true,
  },
  dictCode: { desc: '字典编码', visible: true, disabled: true },
  sortOrder: { desc: '排序序号', visible: true, disabled: true },
  status: { desc: '字典状态', visible: true, disabled: true },
  remark: { desc: '字典描述', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
