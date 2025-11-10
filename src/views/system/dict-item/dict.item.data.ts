import type {
  SysDictItemOperationRequest,
  SysDictItemResponse,
} from '@/service/model/system/dict.item.model'
import { DictItemStatusEnums } from '@/service/model/system/dict.item.model'
import type { FormRules } from 'element-plus'
import { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysDictItemOperationForm: SysDictItemOperationRequest = {
  id: null, // 字典项ID
  dictId: null, // 所属字典ID
  itemLabel: '', // 字典项标签
  itemValue: '', // 字典项值
  itemColor: '', // 显示颜色
  sortOrder: 0, // 排序序号
  remark: '暂无', // 字典项描述
  status: DictItemStatusEnums.ENABLED, //状态(1:启用 0:禁用)
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysDictItemOperationRules: FormRules = {
  dictId: [{ required: true, message: '所属字典ID不能为空', trigger: 'blur' }],
  itemLabel: [
    { required: true, message: '字典项标签不能为空', trigger: 'blur' },
    { max: 50, message: '字典项标签长度不能超过50个字符', trigger: 'blur' },
  ],
  itemValue: [
    { required: true, message: '字典项值不能为空', trigger: 'blur' },
    { max: 50, message: '字典项值长度不能超过50个字符', trigger: 'blur' },
  ],
  itemColor: [
    {
      pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      message: '颜色值必须为有效的十六进制颜色代码',
      trigger: 'blur',
    },
  ],
  sortOrder: [
    { required: true, message: '排序序号不能为空', trigger: 'blur' },
    { type: 'number', message: '排序序号必须为数字', trigger: 'blur' },
  ],
  remark: [{ max: 200, message: '字典项描述长度不能超过200个字符', trigger: 'blur' }],
  status: [
    { required: true, message: '状态不能为空', trigger: 'change' },
    {
      validator: (_, value, callback) => {
        if (Object.values(DictItemStatusEnums).includes(value)) {
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
export const SysDictItemColumnOption: ColumnConfig<SysDictItemResponse> = {
  dictCode: { desc: '字典项编码', visible: true, disabled: false },
  itemLabel: { desc: '字典项标签', visible: true, disabled: false },
  itemValue: { desc: '字典项值', visible: true, disabled: false },
  itemColor: { desc: '显示颜色', visible: true, disabled: false },
  sortOrder: { desc: '排序', visible: true, disabled: false },
  remark: { desc: '描述', visible: true, disabled: false },
  status: { desc: '状态', visible: true, disabled: false },

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
