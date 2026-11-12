import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * 图片预览属性
 */
export interface XhtImagePreviewProps {
  previewId: string // 预览ID
  previewInit: SysFilePreviewInitResponse
}
