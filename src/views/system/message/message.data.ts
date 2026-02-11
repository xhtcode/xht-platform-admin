import type { SysMessageResponse } from '@/service/model/system/message.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 站内信 列表显示配置
 */
export const sysMessageColumnOption: ColumnConfig<SysMessageResponse> = {
  senderName: { desc: '发件人名称', visible: true, disabled: true },
  messageType: { desc: '消息类型', visible: true, disabled: true },
  messageTitle: { desc: '消息标题', visible: true, disabled: true },
  cancelTime: { desc: '撤回时间', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
