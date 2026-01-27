import { useMessage } from '@/hooks/use-message'
import _ from 'lodash'
import { AxiosResponse } from 'axios'
/**
 * 生成符合 UUID v4 格式的唯一标识符
 *
 * UUID v4 特点：
 * - 长度为 128 位（16 字节）
 * - 第 6 位（从0开始计数）固定为 4，表示版本号
 * - 第 8 位（从0开始计数）固定为 8、9、A 或 B，表示变体
 *
 * @returns 返回示例为 bd88ca45e63549a5bf0d60b907d93cca 的 UUID 字符串
 */
const generateUUID = () => {
  const array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  array[6] = (array[6] & 0x0f) | 0x40
  array[8] = (array[8] & 0x3f) | 0x80
  return Array.from(array, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
    .join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1$2$3$4$5')
}

/**
 * blob 文件流处理
 * @param response axios 请求返回的响应
 * @param fileName 文件名
 * @returns
 */
const handleDownloadFile = (response: AxiosResponse, fileName?: string) => {
  // 获取返回类型
  const contentType = _.isUndefined(response.headers['content-type']) ? response.headers['Content-Type'] : response.headers['content-type']
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
    // @ts-ignore
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  }, 0)
}

/**
 * 获取交集长度
 * @param dataArray 数据数组
 * @param checkArray 检查数组
 */
function getIntersectionLength(dataArray: string[], checkArray: string[]): number {
  if (!dataArray || !checkArray) {
    return 0
  }
  return _.intersection(dataArray, checkArray)?.length || 0
}

export { generateUUID, handleDownloadFile, getIntersectionLength }
