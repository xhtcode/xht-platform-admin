import type { GenLogResponse } from '@/service/model/generate/log.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 列表显示配置
 */
export const GenLogColumnOption: ColumnConfig<GenLogResponse> = {
  batchNo: { desc: '生成批次号', visible: true, disabled: false },
  generateTime: { desc: '生成时间', visible: true, disabled: false },
  fileCount: { desc: '生成文件数量', visible: true, disabled: false },
  status: { desc: '生成状态', visible: true, disabled: false },
  errorMsg: { desc: '错误信息', visible: true, disabled: false },
}
