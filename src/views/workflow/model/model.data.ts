import type { FlowModelOperationRequest, FlowModelResponse } from '@/service/model/workflow/model.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储 增改页面 表单类型 默认值
 */
export const flowModelOperationForm: FlowModelOperationRequest = {}

/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储 增改页面 表单类型 表单校验
 */
export const flowModelOperationRules: FormRules<Required<FlowModelOperationRequest>> = {
  rev: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  name: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  key: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  category: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  createTime: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  lastUpdateTime: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  version: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  metaInfo: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  deploymentId: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  editorSourceValueId: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  editorSourceExtraValueId: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
  tenantId: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
}

/**
 * 流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储 列表显示配置
 */
export const flowModelColumnOption: ColumnConfig<FlowModelResponse> = {
  rev: { desc: '', visible: true, disabled: true },
  name: { desc: '', visible: true, disabled: true },
  key: { desc: '', visible: true, disabled: true },
  category: { desc: '', visible: true, disabled: true },
  createTime: { desc: '', visible: true, disabled: true },
  lastUpdateTime: { desc: '', visible: true, disabled: true },
  version: { desc: '', visible: true, disabled: true },
  metaInfo: { desc: '', visible: true, disabled: true },
  deploymentId: { desc: '', visible: true, disabled: true },
  editorSourceValueId: { desc: '', visible: true, disabled: true },
  editorSourceExtraValueId: { desc: '', visible: true, disabled: true },
  tenantId: { desc: '', visible: true, disabled: true },
}
