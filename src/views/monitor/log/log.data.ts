import { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 操作日志列表显示配置
 */
export const SysOperLogColumnOption: ColumnConfig<any> = {
  operId: { desc: '日志编号', visible: true, disabled: false, width: '100px' },
  title: { desc: '操作模块', visible: true, disabled: false, width: 120 },
  businessType: { desc: '操作类型', visible: true, disabled: false, width: '100px' },
  requestMethod: { desc: '请求方式', visible: true, disabled: false, width: '100px' },
  operName: { desc: '操作人员', visible: true, disabled: false, width: 120 },
  operIp: { desc: '操作地址', visible: true, disabled: false, width: 120 },
  operLocation: { desc: '操作地点', visible: true, disabled: false, width: 120 },
  status: { desc: '操作状态', visible: true, disabled: false, width: '100px' },
  operTime: { desc: '操作时间', visible: true, disabled: false, width: '180px' },
}
