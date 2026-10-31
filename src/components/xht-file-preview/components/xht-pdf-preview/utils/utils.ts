import { HTML_ESCAPES } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/constants'

/**
 * 附件体积展示（B / KB / MB）
 *
 * @param bytes 字节数
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * 触发浏览器下载
 *
 * @param href 下载地址（blob 或可访问的直链）
 * @param name 保存文件名
 */
export const triggerDownload = (href: string, name = '') => {
  const link = document.createElement('a')
  link.href = href
  if (name) link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 转义 HTML 特殊字符
 *
 * @param text 原始文本
 */
export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
