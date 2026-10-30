import { PDF_TO_CSS_UNITS, PREPARING_HTML, PRINT_SCALE } from './constants'
import type { PdfCoreContext } from './types'
import { escapeHtml } from './utils'

/**
 * 打印模块返回值
 */
export interface PrintFeature {
  handlePrint: () => Promise<void>
  /** 组件卸载时关闭残留的打印窗口 */
  closeWindow: () => void
}

/**
 * 组装打印页面：每页一张图片，逐页分页
 *
 * @param title 文档名（窗口标题）
 * @param images 各页图片的 dataURL
 */
const buildPrintHtml = (title: string, images: string[]) => `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { margin: 0; }
      /* 独立打印窗口 HTML，不参与暗黑模式，故不使用变量 */
      html, body { margin: 0; padding: 0; background: #fff; }
      img { display: block; width: 100%; page-break-after: always; break-after: page; }
      img:last-child { page-break-after: auto; break-after: auto; }
    </style>
  </head>
  <body>${images.map((src) => `<img src="${src}" alt="" />`).join('')}</body>
</html>`

/**
 * 等待打印窗口内的图片解码完成，避免打印出空白页
 *
 * @param win 打印窗口
 */
const waitForImages = async (win: Window) => {
  const images = Array.from(win.document.images)
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve()
            return
          }
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })
    )
  )
}

/**
 * 创建打印模块：逐页离屏渲染成图片后交给独立窗口打印，避免把后台界面一起打进纸张
 *
 * @param ctx         核心上下文
 * @param displayName 展示用文件名（打印窗口标题）
 */
export const createPrintFeature = (ctx: PdfCoreContext, displayName: () => string): PrintFeature => {
  // 注意：图层配置读取器在模块装配后才补齐，必须通过 ctx 现取，不能在创建时解构
  const { state, message, getDoc } = ctx

  let printWindow: Window | null = null

  const handlePrint = async () => {
    const doc = getDoc()
    if (!doc || state.printing) return
    const win = window.open('', '_blank', 'width=960,height=1080')
    if (!win) {
      message.warning('打印窗口被浏览器拦截，请允许本站弹出窗口后重试')
      return
    }
    printWindow = win
    state.printing = true
    win.document.write(PREPARING_HTML)
    win.document.close()
    try {
      const images: string[] = []
      for (let index = 1; index <= doc.numPages; index++) {
        const page = await doc.getPage(index)
        const viewport = page.getViewport({ scale: PRINT_SCALE * PDF_TO_CSS_UNITS })
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = Math.floor(viewport.width)
        pageCanvas.height = Math.floor(viewport.height)
        await page.render({ canvas: pageCanvas, viewport, optionalContentConfigPromise: ctx.getOcConfigPromise() ?? undefined }).promise
        images.push(pageCanvas.toDataURL('image/jpeg', 0.92))
        // 及时释放离屏画布，长文档逐页打印时控制内存占用
        pageCanvas.width = 0
        pageCanvas.height = 0
      }
      win.document.open()
      win.document.write(buildPrintHtml(displayName(), images))
      win.document.close()
      await waitForImages(win)
      // 打印对话框关闭后再关窗，避免部分浏览器因立即关窗中断打印
      win.onafterprint = () => win.close()
      win.focus()
      win.print()
    } catch (error) {
      console.error('PDF打印失败:', error)
      message.error('打印内容生成失败，请下载后本地打印')
      win.close()
    } finally {
      state.printing = false
    }
  }

  const closeWindow = () => {
    printWindow?.close()
    printWindow = null
  }

  return { handlePrint, closeWindow }
}
