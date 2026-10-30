import type { Ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { AttachmentItem, PdfCoreContext } from './types'

/**
 * 附件模块返回值
 */
export interface AttachmentsFeature {
  attachments: Ref<AttachmentItem[]>
  attachmentsLoading: Ref<boolean>
  loadAttachments: (doc: PDFDocumentProxy) => Promise<void>
  handleAttachmentClick: (item: AttachmentItem) => Promise<void>
}

/**
 * 创建附件（内嵌文件）功能模块
 *
 * @param ctx 核心上下文
 */
export const createAttachmentsFeature = (ctx: PdfCoreContext): AttachmentsFeature => {
  const { getDoc, isCurrentDoc, triggerDownload, message } = ctx

  const attachments = ref<AttachmentItem[]>([])
  const attachmentsLoading = ref(false)

  /**
   * 加载文档内嵌附件；无附件时置空
   *
   * @param doc 已加载的文档代理
   */
  const loadAttachments = async (doc: PDFDocumentProxy) => {
    attachmentsLoading.value = true
    try {
      const map = await doc.getAttachments()
      if (!isCurrentDoc(doc)) return
      attachments.value = map
        ? [...map.entries()].map(([id, item]) => ({
            id,
            filename: item.filename || '未命名附件',
            description: item.description || '',
            size: item.content?.byteLength ?? 0,
          }))
        : []
    } catch (error) {
      console.error('PDF附件加载失败:', error)
      attachments.value = []
    } finally {
      if (isCurrentDoc(doc)) attachmentsLoading.value = false
    }
  }

  /**
   * 下载附件（附件内容需现取，取回后转 blob 触发保存）
   *
   * @param item 附件条目
   */
  const handleAttachmentClick = async (item: AttachmentItem) => {
    const doc = getDoc()
    if (!doc) return
    try {
      const content = await doc.getAttachmentContent(item.id)
      if (!content?.byteLength) {
        message.error('附件内容为空，无法下载')
        return
      }
      // pdf.js 返回的是 ArrayBuffer/TypedArray 视图，经 Uint8Array 归一为合法 BlobPart（无需断言）
      const blob = new Blob([new Uint8Array(content)], { type: 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      triggerDownload(url, item.filename)
      // 下载已触发，稍后再释放地址，避免部分浏览器尚未开始读取
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error('PDF附件下载失败:', error)
      message.error('附件下载失败，请下载 PDF 后查看')
    }
  }

  return { attachments, attachmentsLoading, loadAttachments, handleAttachmentClick }
}
