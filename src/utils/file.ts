import _ from 'lodash'
import type { AxiosResponse } from 'axios'
import { downloadSysFile } from '@/service/api/system/file.api'

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
 * 文件下载方法
 *
 * @param href 文件地址
 * @param filename 文件名
 */
export const downloadFile = (href: string, filename: string) => {
  if (href && filename) {
    const a: HTMLAnchorElement = document.createElement('a')
    a.download = filename // 指定下载的文件名
    a.href = href // URL 对象
    a.click() // 模拟点击
    URL.revokeObjectURL(a.href) // 释放 URL 对象
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
  // 后端通过 xht-download-filename 响应头携带 URL 编码后的文件名，优先使用响应头中的文件名
  if (response.headers['xht-download-filename']) {
    handleDownloadFile(response)
  } else {
    handleDownloadFile(response, '下载文件')
  }
  return true
}

/**
 * 读取文件流文本内容（用于 JSON 等需要二次处理的场景）
 *
 * @param url 文件地址（blob 地址或可访问的预览地址）
 * @returns 文件文本内容
 */
export const readFileText = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`文件读取失败：${response.status}`)
  }
  return response.text()
}
