import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * 视频预览属性
 */
export interface XhtVideoPreviewProps {
  previewId: string // 预览ID
  previewInit: SysFilePreviewInitResponse
}
