import _ from 'lodash'
import type { AxiosResponse } from 'axios'
import { downloadSysFilePreview } from '@/service/api/system/file.api'
import { parsePreviewBusinessError } from '@/utils/file-preview'

/**
 * 格式化文件大小（和后端对齐，优先向上换算单位）
 *
 * 截断到 2 位小数（不四舍五入，避免虚报大小）：5240000 → 4.99 MB，5241860 → 4.99 MB
 *
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number | undefined | null): string {
  if (!bytes || isNaN(bytes)) return '0.00 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = Number(bytes)
  let unitIndex = 0
  const base = 1024

  while (size >= base && unitIndex < units.length - 1) {
    size /= base
    unitIndex++
  }
  // 先乘100向下取整，再除以100，解决toFixed浮点坑
  const fixedNum = Math.floor(size * 100) / 100
  return fixedNum.toFixed(2) + ' ' + units[unitIndex]
}

/**
 * 拼接头像可访问地址
 *
 * 头像值通常是相对路径（如 `files/avatar/xxx.png`），需补上网关前缀才能被 `<img>`
 * 或 canvas 等浏览器原生请求访问；http(s)、协议相对、data、blob 地址原样返回。
 *
 * @param value 头像值
 */
export const resolveAvatarUrl = (value?: string): string => {
  if (!value) return ''
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value
  const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX
  return `${baseURL}${value.startsWith('/') ? '' : '/'}${value}`
}

/**
 * blob 文件流处理
 *
 * @param response axios 请求返回的响应
 * @param fileName 文件名
 */
export const handleDownloadFile = (response: AxiosResponse<Blob>, fileName?: string) => {
  // 获取返回类型（响应头值可能是数组/数字/空值，Blob 只接受字符串形态）
  const rawContentType = response.headers['content-type'] ?? response.headers['Content-Type']
  const contentType = typeof rawContentType === 'string' ? rawContentType : undefined
  // 构建下载数据
  const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', decodeURIComponent(_.isUndefined(fileName) ? response.headers['xht-download-filename'] : fileName))
  // 触发点击下载
  document.body.appendChild(link)
  link.click()
  // 下载完释放
  window.setTimeout(function () {
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  }, 0)
}

/**
 * 下载预览文件
 *
 * 下载凭证是 `previewId`（预览会话本身），不再使用存储 key：
 * 服务端会按会话绑定的权限判定，并返回**原始文件**（而非转换产物）。
 *
 * @param previewId 预览ID（来自预览初始化响应）
 * @returns true：下载成功 false：无预览凭证（失败信息已由调用方或拦截器提示）
 */
export const handleDownloadPreviewFile = async (previewId: string): Promise<boolean> => {
  if (!previewId) return false
  const response = await downloadSysFilePreview(previewId)
  // 下载接口失败时同样以 HTTP 200 返回业务信封，必须先嗅探再落盘，避免存下 error.json
  const businessError = await parsePreviewBusinessError(response.data)
  if (businessError) throw businessError
  // 后端通过 xht-download-filename 响应头携带 URL 编码后的文件名，优先使用响应头中的文件名
  if (response.headers['xht-download-filename']) {
    handleDownloadFile(response)
  } else {
    handleDownloadFile(response, '下载文件')
  }
  return true
}
