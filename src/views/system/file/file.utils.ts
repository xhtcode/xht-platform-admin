import type { AxiosResponse } from 'axios'
import { downloadSysFile } from '@/service/api/system/file.api'
import { useMessage } from '@/hooks/use-message'
import { handleDownloadFile } from '@/utils'

/**
 * 文件预览模式
 */
export type FilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'other'

/**
 * 图片后缀
 */
const IMAGE_SUFFIX: string[] = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg']

/**
 * PDF后缀
 */
const PDF_SUFFIX: string[] = ['pdf']

/**
 * 视频后缀
 */
const VIDEO_SUFFIX: string[] = ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'avi']

/**
 * 音频后缀
 */
const AUDIO_SUFFIX: string[] = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']

/**
 * 文本后缀
 */
const TEXT_SUFFIX: string[] = ['txt', 'log', 'json', 'xml', 'csv', 'md', 'yml', 'yaml', 'sql', 'ini', 'conf', 'properties']

/**
 * 文本类型MIME
 */
const TEXT_MIME: string[] = ['text/plain', 'text/csv', 'text/markdown', 'application/json', 'application/xml', 'text/xml']

/**
 * 解析文件响应中的业务异常信息
 * <p>
 * blob 文件流请求发生业务异常时（如文件不存在、已删除），后端统一以 JSON 结构返回错误信息。
 * 按约定错误文案完全透传后端 msg，不补充兜底文案。
 *
 * @param response 文件请求响应
 * @returns 业务异常信息，非异常响应或后端未提供 msg 时返回空字符串
 */
export const parseFileErrorResponse = async (response: AxiosResponse<Blob>): Promise<string> => {
  const contentType = (response.headers['content-type'] as string) || ''
  if (!contentType.includes('application/json')) {
    return ''
  }
  try {
    const text = await response.data.text()
    const { msg } = JSON.parse(text)
    return msg ?? ''
  } catch {
    return ''
  }
}

/**
 * 下载系统文件
 *
 * @param fileStorageKey 文件存储key
 * @returns true：下载成功 false：下载失败（失败信息已提示）
 */
export const handleDownloadSysFile = async (fileStorageKey: string): Promise<boolean> => {
  const response = await downloadSysFile(fileStorageKey)
  const errorMsg = await parseFileErrorResponse(response)
  if (errorMsg) {
    useMessage().error(errorMsg)
    return false
  }
  // 后端通过 xht-download-filename 响应头携带 URL 编码后的文件名，优先使用响应头中的文件名
  if (response.headers['xht-download-filename']) {
    handleDownloadFile(response)
  } else {
    handleDownloadFile(response, '下载文件')
  }
  return true
}

/**
 * 解析文件预览模式
 *
 * @param fileType   文件类型（MIME）
 * @param fileSuffix 文件后缀
 * @returns 预览模式，无法安全预览的类型返回 other（与后端预览策略保持一致：HTML、SVG 等主动内容类型降级为附件下载）
 */
export const resolvePreviewMode = (fileType?: string, fileSuffix?: string): FilePreviewMode => {
  const mime = (fileType || '').split(';')[0].trim().toLowerCase()
  if (mime) {
    if (mime.startsWith('image/')) {
      return 'image'
    }
    if (mime === 'application/pdf') {
      return 'pdf'
    }
    if (mime.startsWith('video/')) {
      return 'video'
    }
    if (mime.startsWith('audio/')) {
      return 'audio'
    }
    if (TEXT_MIME.includes(mime)) {
      return 'text'
    }
    if (mime.startsWith('text/') || mime.includes('html') || mime.includes('javascript')) {
      // 可执行脚本的主动内容类型不允许内联预览
      return 'other'
    }
  }
  const suffix = (fileSuffix || '').toLowerCase()
  if (IMAGE_SUFFIX.includes(suffix)) {
    return 'image'
  }
  if (PDF_SUFFIX.includes(suffix)) {
    return 'pdf'
  }
  if (VIDEO_SUFFIX.includes(suffix)) {
    return 'video'
  }
  if (AUDIO_SUFFIX.includes(suffix)) {
    return 'audio'
  }
  if (TEXT_SUFFIX.includes(suffix)) {
    return 'text'
  }
  return 'other'
}
