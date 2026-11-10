import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysFileShareReceivedResponse, SysFileShareResponse } from '@/service/model/system/file-share.model'

/**
 * 「我分享的」列表显示配置
 */
export const sysFileShareColumnOption: ColumnConfig<SysFileShareResponse> = {
  fileName: { desc: '文件名', visible: true, disabled: true },
  shareMode: { desc: '分享方式', visible: true, disabled: false },
  permission: { desc: '分享权限', visible: true, disabled: false },
  receiverCount: { desc: '接收人数', visible: true, disabled: false },
  accessCount: { desc: '访问次数', visible: true, disabled: false },
  requireCode: { desc: '提取码', visible: false, disabled: false },
  expireAt: { desc: '有效期至', visible: true, disabled: false },
  status: { desc: '状态', visible: true, disabled: false },
  createTime: { desc: '创建时间', visible: true, disabled: false },
}

/**
 * 「分享给我的」列表显示配置
 */
export const sysFileReceivedColumnOption: ColumnConfig<SysFileShareReceivedResponse> = {
  fileName: { desc: '文件名', visible: true, disabled: true },
  creatorName: { desc: '分享人', visible: true, disabled: false },
  permission: { desc: '分享权限', visible: true, disabled: false },
  readStatus: { desc: '已读状态', visible: true, disabled: false },
  firstViewTime: { desc: '首次查看时间', visible: true, disabled: false },
  expireAt: { desc: '有效期至', visible: true, disabled: false },
  status: { desc: '状态', visible: true, disabled: false },
}

/**
 * 当前时间字符串（与后端 `yyyy-MM-dd HH:mm:ss` 同格式，可直接做字符串比较）
 */
export const nowString = (): string => {
  const now = new Date()
  const pad = (value: number) => `${value}`.padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

/**
 * 分享是否已过期（status 正常但已过有效期）
 *
 * @param expireAt 过期时间
 */
export const isShareExpired = (expireAt?: string | null): boolean => {
  if (!expireAt) return false
  return expireAt < nowString()
}
