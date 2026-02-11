import type { SysNoticeOperationRequest, SysNoticeResponse } from '@/service/model/system/notice.model'
import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import { noticeJumpTypeEnums, noticeStatusEnums, noticeTimedPublishEnums, noticeTopEnums } from '@/service/enums/system/notice.enum'

/**
 * 通知 增改页面 表单类型 默认值
 */
export const sysNoticeOperationForm: SysNoticeOperationRequest = {
  noticeOrder: 1, // 通知排序
  noticeStatus: noticeStatusEnums.NOT_PUBLISH.value, // 通知状态
  noticeTop: noticeTopEnums.NO.value, // 是否置顶
  noticeJumpType: noticeJumpTypeEnums.NO_JUMP.value, // 跳转类型
  noticeTimedPublish: noticeTimedPublishEnums.NOT_PUBLISH.value, // 是否定时发布
  noticeRemark: '暂无', // 备注
}

/**
 * 通知 增改页面 表单类型 表单校验
 */
export const sysNoticeOperationRules: FormRules<Required<SysNoticeOperationRequest>> = {
  noticeTypeId: [{ required: true, message: '请输入通知类型', trigger: ['blur', 'change'] }],
  noticeTitle: [{ required: true, message: '请输入通知标题', trigger: ['blur', 'change'] }],
  noticeSummary: [{ required: true, message: '请输入通知摘要', trigger: ['blur', 'change'] }],
  noticeContent: [{ required: true, message: '请输入通知内容', trigger: ['blur', 'change'] }],
  noticeStatus: [{ required: true, message: '请输入通知状态', trigger: ['blur', 'change'] }],
  noticeOrder: [{ required: true, message: '请输入通知排序', trigger: ['blur', 'change'] }],
  noticeTop: [{ required: true, message: '请输入是否置顶', trigger: ['blur', 'change'] }],
  noticeTimedPublish: [{ required: true, message: '请输入是否定时发布', trigger: ['blur', 'change'] }],
  noticePublishTime: [{ required: true, message: '请输入发布时间', trigger: ['blur', 'change'] }],
  noticeJumpType: [{ required: true, message: '请输入跳转类型', trigger: ['blur', 'change'] }],
  noticeJumpUrl: [{ required: true, message: '请输入跳转地址', trigger: ['blur', 'change'] }],
  noticeRemark: [{ required: true, message: '请输入备注', trigger: ['blur', 'change'] }],
}

/**
 * 通知 列表显示配置
 */
export const sysNoticeColumnOption: ColumnConfig<SysNoticeResponse> = {
  noticeTypeName: { desc: '通知类型', visible: true, disabled: true },
  noticeTitle: { desc: '通知标题', visible: true, disabled: true },
  noticeSummary: { desc: '通知摘要', visible: true, disabled: false },
  noticeStatus: { desc: '通知状态', visible: true, disabled: true },
  noticeOrder: { desc: '通知排序', visible: true, disabled: false },
  noticeTop: { desc: '置顶状态', visible: false, disabled: false },
  noticeTimedPublish: { desc: '定时发布', visible: false, disabled: false },
  noticePublishTime: { desc: '发布时间', visible: true, disabled: false },
  noticeExpireTime: { desc: '过期时间', visible: false, disabled: false },
  noticeOfflineTime: { desc: '下架时间', visible: false, disabled: false },
  noticeJumpType: { desc: '跳转类型', visible: false, disabled: false },
  noticeJumpUrl: { desc: '跳转地址', visible: false, disabled: false },
  noticeReadCount: { desc: '已读人数', visible: true, disabled: false },
  noticeClickCount: { desc: '点击次数', visible: true, disabled: false },
  noticeRemark: { desc: '备注', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
