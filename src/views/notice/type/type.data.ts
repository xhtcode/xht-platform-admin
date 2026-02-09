import { NoticeTypeStatusEnums, SysNoticeTypeOperationRequest, SysNoticeTypeResponse } from '@/service/model/notice/type.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 系统管理-通知类型 增改页面 表单类型 默认值
 */
export const sysNoticeTypeOperationForm: SysNoticeTypeOperationRequest = {
  noticeTypeStatus: NoticeTypeStatusEnums.ENABLE, // 0:未启用 1:启用
  noticeTypeSort: 0, // 通知排序
}

/**
 * 系统管理-通知类型 增改页面 表单类型 表单校验
 */
export const sysNoticeTypeOperationRules: FormRules<Required<SysNoticeTypeOperationRequest>> = {
  noticeTypeName: [{ required: true, message: '请输入类型名称', trigger: ['blur', 'change'] }],
  noticeTypeStatus: [{ required: true, message: '请选择通知状态', trigger: ['blur', 'change'] }],
  noticeTypeSort: [{ required: true, message: '请输入通知排序', trigger: ['blur', 'change'] }],
}

/**
 * 系统管理-通知类型 列表显示配置
 */
export const sysNoticeTypeColumnOption: ColumnConfig<SysNoticeTypeResponse> = {
  noticeTypeName: { desc: '类型名称', visible: true, disabled: true },
  noticeTypeSort: { desc: '通知排序', visible: true, disabled: true },
  createBy: { desc: '创建人', visible: true, disabled: true },
  createTime: { desc: '创建时间', visible: true, disabled: true },
  updateBy: { desc: '更新人', visible: true, disabled: true },
  updateTime: { desc: '更新时间', visible: true, disabled: true },
}
