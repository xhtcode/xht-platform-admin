import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * JSON 预览属性
 */
export interface XhtJsonPreviewProps {
  previewId: string // 预览ID
  previewInit: SysFilePreviewInitResponse
}
