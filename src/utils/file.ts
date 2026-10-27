import type { AxiosResponse } from 'axios'
import { downloadSysFile } from '@/service/api/system/file.api'
import { useMessage } from '@/hooks/use-message'
import { handleDownloadFile } from '@/utils/index'

/**
 * 解析文件流响应中的业务异常信息
 * <p>
 * blob 请求不经过响应拦截器的业务信封解包，业务异常（如文件不存在、已删除）时后端以 JSON 结构返回错误信息。
 * 按约定错误文案完全透传后端 msg，不补充兜底文案。
 *
 * @param response 文件流请求响应
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
