import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 站内信 列表显示配置
 */
export const sysMessageColumnOption: ColumnConfig<any> = {
  senderName: { desc: '发件人', visible: true, disabled: true },
  messageTitle: { desc: '消息标题', visible: true, disabled: true },
  messageType: { desc: '消息类型', visible: true, disabled: true },
  messageStatus: { desc: '消息状态', visible: true, disabled: true },
  readTime: { desc: '已读时间', visible: true, disabled: false },
  createTime: { desc: '发送时间', visible: true, disabled: false },
}
