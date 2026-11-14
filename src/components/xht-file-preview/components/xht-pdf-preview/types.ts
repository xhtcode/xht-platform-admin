import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * PDF 预览属性（组件对外契约；内部状态与模块上下文见 `utils/types.ts`）
 */
export interface XhtPdfPreviewProps {
  previewId: string // 预览ID
  previewInit: SysFilePreviewInitResponse
}
