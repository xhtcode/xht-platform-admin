import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * 音频预览属性
 */
export interface XhtAudioPreviewProps {
  previewId: string // 预览ID
  previewInit: SysFilePreviewInitResponse
}
