import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * 预览布局属性
 */
export interface XhtPreviewLayoutProps {
  fileStorageKey: string
  fileName?: string
  fileSuffix?: string
  fileSizeInfo?: string
  previewInit: SysFilePreviewInitResponse
}
