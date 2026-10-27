import type { XhtFilePreviewMode } from '@/components/xht-file-preview/types'

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
 * JSON后缀
 */
const JSON_SUFFIX: string[] = ['json']

/**
 * 文本后缀
 */
const TEXT_SUFFIX: string[] = ['txt', 'log', 'xml', 'csv', 'md', 'yml', 'yaml', 'sql', 'ini', 'conf', 'properties']

/**
 * 文本类型MIME
 */
const TEXT_MIME: string[] = ['text/plain', 'text/csv', 'text/markdown', 'application/xml', 'text/xml']

/**
 * 解析文件预览模式
 *
 * @param fileType   文件类型（MIME）
 * @param fileSuffix 文件后缀
 * @returns 预览模式，无法安全预览的类型返回 other（与后端预览策略保持一致：HTML、SVG 等主动内容类型降级为附件下载）
 */
export const resolvePreviewMode = (fileType?: string, fileSuffix?: string): XhtFilePreviewMode => {
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
    if (mime === 'application/json') {
      return 'json'
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
  if (JSON_SUFFIX.includes(suffix)) {
    return 'json'
  }
  if (TEXT_SUFFIX.includes(suffix)) {
    return 'text'
  }
  return 'other'
}
