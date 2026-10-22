import type { BLogResponse } from '@/service/model/monitor/blog.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 列表显示配置
 */
export const bLogColumnOption: ColumnConfig<BLogResponse> = {
  title: { desc: '日志模块', visible: true, disabled: true },
  serviceName: { desc: '服务名称', visible: true, disabled: false },
  classMethod: { desc: '类名.方法名', visible: true, disabled: false },
  executeAccount: { desc: '执行账号', visible: true, disabled: false },
  executeCost: { desc: '执行耗时', visible: true, disabled: false },
  executeStatus: { desc: '执行状态', visible: true, disabled: false },
  executeTime: { desc: '执行时间', visible: true, disabled: false },
  traceId: { desc: '链路ID', visible: false, disabled: false },
}
