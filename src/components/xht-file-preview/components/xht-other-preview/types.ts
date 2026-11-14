import type { SysFilePreviewInitResponse } from '@/service/model/system/file.model.ts'

/**
 * 其它类型文件属性
 *
 * 浏览器无法内联渲染的文件（Office、压缩包、可执行文件等）统一走下载，
 * 下载入口按会话能力位显隐，不单独收下载开关。
 */
export interface XhtOtherPreviewProps {
  previewId: string // 预览ID（下载凭证）
  previewInit: SysFilePreviewInitResponse
}
