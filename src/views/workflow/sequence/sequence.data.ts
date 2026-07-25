import type { FlowSequenceOperationRequest, FlowSequenceResponse } from '@/service/model/workflow/sequence.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 流程扩展-流程序列号 增改页面 表单类型 默认值
 */
export const flowSequenceOperationForm: FlowSequenceOperationRequest = {}

/**
 * 流程扩展-流程序列号 增改页面 表单类型 表单校验
 */
export const flowSequenceOperationRules: FormRules<Required<FlowSequenceOperationRequest>> = {
  sequenceCode: [{ required: true, message: '请输入序列编码', trigger: ['blur', 'change'] }],
  sequenceName: [{ required: true, message: '请输入序列名称', trigger: ['blur', 'change'] }],
  sequenceFormat: [
    {
      required: true,
      message: '请输入序列格式',
      trigger: ['blur', 'change'],
    },
  ],
  minValue: [{ required: true, message: '请输入最小值', trigger: ['blur', 'change'] }],
  maxValue: [{ required: true, message: '请输入最大值', trigger: ['blur', 'change'] }],
  currentValue: [{ required: true, message: '请输入当前值', trigger: ['blur', 'change'] }],
  steppingValue: [{ required: true, message: '请输入步进值', trigger: ['blur', 'change'] }],
  isCycle: [{ required: true, message: '请输入是否循环', trigger: ['blur', 'change'] }],
  resetFlag: [{ required: true, message: '请输入重置周期', trigger: ['blur', 'change'] }],
}

/**
 * 流程扩展-流程序列号 列表显示配置
 */
export const flowSequenceColumnOption: ColumnConfig<FlowSequenceResponse> = {
  sequenceName: { desc: '序列名称', visible: true, disabled: true },
  sequenceCode: { desc: '序列编码', visible: true, disabled: true },
  sequenceFormat: {
    desc: '序列格式',
    visible: false,
    disabled: false,
  },
  minValue: { desc: '最小值', visible: true, disabled: false },
  maxValue: { desc: '最大值', visible: true, disabled: false },
  currentValue: { desc: '当前值', visible: true, disabled: false },
  steppingValue: { desc: '步进值', visible: true, disabled: false },
  isCycle: { desc: '是否循环', visible: true, disabled: false },
  resetFlag: { desc: '重置周期', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: true, disabled: true },
  createTime: { desc: '创建时间', visible: true, disabled: true },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
