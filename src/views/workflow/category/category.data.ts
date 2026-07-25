import type { FlowCategoryOperationRequest, FlowCategoryResponse } from '@/service/model/workflow/category.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { FALSE } from 'sass'

/**
 * 流程扩展-流程分类 增改页面 表单类型 默认值
 */
export const flowCategoryOperationForm: FlowCategoryOperationRequest = {}

/**
 * 流程扩展-流程分类 增改页面 表单类型 表单校验
 */
export const flowCategoryOperationRules: FormRules<Required<FlowCategoryOperationRequest>> = {
  categoryCode: [{ required: true, message: '请输入类别编码', trigger: ['blur', 'change'] }],
  categoryName: [{ required: true, message: '请输入类别名称', trigger: ['blur', 'change'] }],
  categoryDesc: [{ required: true, message: '请输入类别描述', trigger: ['blur', 'change'] }],
  categoryStatus: [{ required: true, message: '请输入类别状态', trigger: ['blur', 'change'] }],
  categorySort: [{ required: true, message: '请输入类别排序', trigger: ['blur', 'change'] }],
}

/**
 * 流程扩展-流程分类 列表显示配置
 */
export const flowCategoryColumnOption: ColumnConfig<FlowCategoryResponse> = {
  categoryName: { desc: '类别名称', visible: true, disabled: true },
  categoryCode: { desc: '类别编码', visible: true, disabled: true },
  categoryDesc: { desc: '类别描述', visible: false, disabled: false },
  categoryStatus: { desc: '类别状态', visible: true, disabled: false },
  categorySort: { desc: '类别排序', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: true, disabled: true },
  createTime: { desc: '创建时间', visible: true, disabled: true },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
