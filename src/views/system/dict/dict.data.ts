import type { SysDictOperationRequest } from '@/model/system/dict.model'
import { DictStatusEnums } from '@/model/system/dict.model'
import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysDictOperationForm: SysDictOperationRequest = {
  id: null, //字典ID
  dictCode: '', //字典编码
  dictName: '', //字典名称
  sortOrder: 0, //排序序号
  remark: '', //字典描述
  status: DictStatusEnums.ENABLED, //状态(1:启用 0:禁用)
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysDictOperationRules: FormRules = {
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
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' },
    {
      validator: (_, value, callback) => {
        if (Object.values(DictStatusEnums).includes(value)) {
          callback()
        } else {
          callback(new Error('状态值无效'))
        }
      },
      trigger: 'change',
    },
  ],
}

/**
 * 列表显示配置
 */
export const SysDictColumnOption: ColumnOption[] = []
