import type { PdfCoreContext } from './types'

/**
 * 演示模式模块返回值
 */
export interface PresentationFeature {
  togglePresentation: () => Promise<void>
  exitPresentation: () => void
  /** 浏览器退出全屏时同步退出演示模式（全局 fullscreenchange 回调） */
  handleFullscreenChange: () => void
}

/**
 * 创建演示模式模块：内容区全屏 + 整页适配，方向键/空格翻页（翻页由全局快捷键处理），退出全屏即恢复
 *
 * @param ctx         核心上下文
 * @param closeSearch 进入演示模式前收起搜索栏
 */
export const createPresentationFeature = (ctx: PdfCoreContext, closeSearch: () => void): PresentationFeature => {
  const { state, containerRef, sidebarVisible, scaleForMode, clearRendered, refreshAfterScaleChange } = ctx

  /**
   * 退出演示模式：恢复自动缩放
   */
  const exitPresentation = () => {
    if (!state.presenting) return
    state.presenting = false
    state.zoomMode = 'auto'
    state.scale = scaleForMode('auto')
    clearRendered()
    nextTick(() => refreshAfterScaleChange(state.current))
  }

  /**
   * 演示模式：内容区全屏 + 整页适配，退出全屏即恢复
   */
  const togglePresentation = async () => {
    const container = containerRef.value
    if (!container) return
    if (state.presenting) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
      exitPresentation()
      return
    }
    try {
      await container.requestFullscreen()
    } catch {
      // 无头/受限环境可能拒绝全屏，仍进入演示布局
    }
    closeSearch()
    sidebarVisible.value = false
    state.presenting = true
    state.zoomMode = 'page-fit'
    state.scale = scaleForMode('page-fit')
    clearRendered()
    await nextTick()
    refreshAfterScaleChange(state.current)
  }

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) exitPresentation()
  }

  return { togglePresentation, exitPresentation, handleFullscreenChange }
}
