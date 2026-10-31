import { nextTick } from 'vue'
import { PDF_TO_CSS_UNITS, PRINT_SCALE } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/constants'
import type { PdfCoreContext } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/types'
import { escapeHtml } from '@/components/xht-file-preview/components/xht-pdf-preview/utils/utils'

/**
 * 打印模块返回值
 */
export interface PrintFeature {
  handlePrint: () => Promise<void>
  /** 组件卸载时清理残留的打印容器 */
  closeWindow: () => void
}

/**
 * 打印容器尺寸：按 A4 纵向（96dpi ≈ 794×1123px）给足布局宽度，
 * 保证 iframe 内的图片按纸张宽度排版、分页正确
 */
const PRINT_FRAME_WIDTH = 794
const PRINT_FRAME_HEIGHT = 1123

/**
 * 组装打印页面：每页一张图片，一页一个满页容器
 *
 * 分页交给「每页一个 100vh 容器」而不是图片自身的 page-break：
 * 图片按纸宽自适应时，只要页面比例与纸张不完全一致（Letter 纸、扫描件、横向页等）
 * 高度就会略微超出页高，溢出的那一点点会再撑出一张空白纸。
 * 容器固定为页高 + 图片等比缩放塞进容器，任何纸张下都是「一页图 = 一张纸」。
 *
 * @param title 文档名
 * @param images 各页图片的 dataURL
 */
const buildPrintHtml = (title: string, images: string[]) => `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { margin: 0; }
      /* 独立打印文档，不参与暗黑模式，故不使用变量 */
      html, body { margin: 0; padding: 0; background: #fff; }
      .xht-print-page {
        display: flex;
        width: 100%;
        height: 100vh;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      .xht-print-page:last-child { page-break-after: auto; break-after: auto; }
      .xht-print-page img { display: block; max-width: 100%; max-height: 100%; }
    </style>
  </head>
  <body>${images.map((src) => `<div class="xht-print-page"><img src="${src}" alt="" /></div>`).join('')}</body>
</html>`

/**
 * 等待打印容器内的图片解码完成，避免打印出空白页
 *
 * @param doc 打印容器文档
 */
const waitForImages = async (doc: Document) => {
  const images = Array.from(doc.images)
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
 * 创建打印模块：逐页离屏渲染成图片后写入隐藏 iframe 再打印，
 * 既不会把后台界面一起打进纸张，也不会像 window.open 那样弹出新窗口
 *
 * @param ctx         核心上下文
 * @param displayName 展示用文件名（打印文件名）
 */
export const createPrintFeature = (ctx: PdfCoreContext, displayName: () => string): PrintFeature => {
  // 注意：图层配置读取器在模块装配后才补齐，必须通过 ctx 现取，不能在创建时解构
  const { state, message, getDoc } = ctx

  let printFrame: HTMLIFrameElement | null = null
  /** 打印期间临时替换的顶层标题恢复函数 */
  let restoreTitle: (() => void) | null = null

  const removeFrame = () => {
    printFrame?.remove()
    printFrame = null
    restoreTitle?.()
    restoreTitle = null
  }

  /**
   * 复用（或新建）隐藏打印容器：移出可视区，不参与页面布局与交互
   */
  const ensureFrame = () => {
    if (printFrame?.isConnected) return printFrame
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.setAttribute('title', '打印内容')
    frame.style.cssText = `position:fixed;left:-9999px;top:0;width:${PRINT_FRAME_WIDTH}px;height:${PRINT_FRAME_HEIGHT}px;border:0;pointer-events:none;`
    document.body.appendChild(frame)
    printFrame = frame
    return frame
  }

  const handlePrint = async () => {
    const doc = getDoc()
    if (!doc || state.printing) return
    state.printing = true
    state.printProgress = 0
    try {
      const frame = ensureFrame()
      const frameDoc = frame.contentDocument
      const frameWin = frame.contentWindow
      if (!frameDoc || !frameWin) throw new Error('打印容器初始化失败')

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
        // 逐页推进进度：页渲染是异步的，遮罩上的进度条能随之中间刷新，大文档不会看起来卡死
        state.printProgress = Math.round((index / doc.numPages) * 100)
      }

      frameDoc.open()
      frameDoc.write(buildPrintHtml(displayName(), images))
      frameDoc.close()
      await waitForImages(frameDoc)

      // 打印预览的默认文件名取自顶层文档标题，打印期间临时替换，结束后恢复
      const originalTitle = document.title
      document.title = displayName()
      restoreTitle = () => {
        document.title = originalTitle
      }
      // 打印预览关闭（含取消）后清理容器
      window.addEventListener('afterprint', removeFrame, { once: true })

      // 先撤下等待遮罩再唤起预览：print() 会阻塞渲染，遮罩留到这一刻会残留在预览背后
      state.printing = false
      await nextTick()

      frameWin.focus()
      frameWin.print()
    } catch (error) {
      console.error('PDF打印失败:', error)
      message.error('打印内容生成失败，请下载后本地打印')
      window.removeEventListener('afterprint', removeFrame)
      removeFrame()
    } finally {
      // 进度留在 100，避免遮罩淡出瞬间回跳到 0；下次打印开始时已在入口重置
      state.printing = false
    }
  }

  const closeWindow = () => {
    window.removeEventListener('afterprint', removeFrame)
    removeFrame()
  }

  return { handlePrint, closeWindow }
}
