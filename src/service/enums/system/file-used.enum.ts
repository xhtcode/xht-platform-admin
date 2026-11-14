import type { FileUsedEnabled } from '@/service/model/system/file-used.model.ts'

/**
 * 文件用途启用状态
 */
export const fileUsedEnabledEnum: DictEnum<FileUsedEnabled, 'ENABLED' | 'DISABLED'> = {
  ENABLED: {
    label: '启用',
    value: 1,
    type: 'success',
  },
  DISABLED: {
    label: '停用',
    value: 0,
    type: 'danger',
  },
}
