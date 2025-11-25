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
 * @param blob Blob文件流
 * @param fileName 文件名称
 * @returns
 */
const handleBlobFile = (blob: Blob, fileName: string) => {
  if (blob && blob.size === 0) {
    useMessage().error('内容为空，无法下载')
    return
  }
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  window.setTimeout(function () {
    URL.revokeObjectURL(blob)
    document.body.removeChild(link)
    link.remove()
  }, 0)
}

export { generateUUID, handleBlobFile }
