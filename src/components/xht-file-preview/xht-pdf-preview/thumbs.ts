import { nextTick, reactive, watch } from 'vue'
import type { Ref } from 'vue'
import type { RenderTask } from 'pdfjs-dist'
import type { PdfCoreContext } from './types'

/** 侧栏标签页类型（缩略图懒渲染只关心 thumb 页） */
export type SidebarTab = 'thumb' | 'outline' | 'attach' | 'layer'

/**
 * 缩略图模块返回值
 */
export interface ThumbsFeature {
  /** 收集 v-for 内的缩略图容器引用 */
  setThumbWrapper: (no: number, el: unknown) => void
  setupThumbObserver: () => void
  invalidateThumbs: () => void
  destroyThumbs: () => void
  thumbWrappers: Map<number, HTMLElement>
  renderedThumbs: Set<number>
}

/**
 * 创建缩略图侧栏功能模块：位图尺寸跟随实际显示宽度（侧栏拖宽后依然清晰），
 * 进入可视区（含上下缓冲）才开始渲染
 *
 * @param ctx         核心上下文
 * @param thumbListRef 缩略图列表容器模板 ref
 * @param sidebarTab   侧栏标签页状态
 */
export const createThumbsFeature = (ctx: PdfCoreContext, thumbListRef: { readonly value: HTMLDivElement | null }, sidebarTab: Ref<SidebarTab>): ThumbsFeature => {
  // 注意：图层配置读取器在模块装配后才补齐，必须通过 ctx 现取，不能在创建时解构
  const { state, sidebarVisible, getDoc, isCurrentDoc } = ctx

  // 各页缩略图容器引用：v-for 内通过函数 ref 收集
  const thumbWrappers = new Map<number, HTMLElement>()
  const thumbTasks = new Map<number, RenderTask>()
  // 已渲染完成的缩略图页码集合
  const renderedThumbs = reactive(new Set<number>())
  let thumbObserver: IntersectionObserver | null = null

  /**
   * 收集 v-for 内的缩略图容器引用
   *
   * @param no 页码
   * @param el ref 元素
   */
  const setThumbWrapper = (no: number, el: unknown) => {
    if (el instanceof HTMLElement) {
      thumbWrappers.set(no, el)
    } else {
      thumbWrappers.delete(no)
    }
  }

  /**
   * 渲染单页缩略图（位图尺寸跟随实际显示宽度，侧栏拖宽后依然清晰）
   *
   * @param no 页码
   */
  const renderThumb = async (no: number) => {
    try {
      await renderThumbInner(no)
    } catch (error) {
      // 渲染取消属正常流程；其余失败不能静默（否则缩略图空白且无任何排查线索）
      if (!/cancel|abort/i.test(String(error))) {
        console.error(`PDF缩略图渲染失败(第${no}页):`, error)
        renderedThumbs.delete(no)
      }
    }
  }

  const renderThumbInner = async (no: number) => {
    const doc = getDoc()
    const wrapper = thumbWrappers.get(no)
    if (!doc || !wrapper || renderedThumbs.has(no)) return
    const canvas = wrapper.querySelector('canvas')
    if (!canvas) return
    // 以纸面容器的实际显示宽度渲染，保证位图与 CSS 尺寸一致
    const cssWidth = canvas.parentElement?.clientWidth ?? 0
    if (cssWidth <= 0) return
    try {
      thumbTasks.get(no)?.cancel()
    } catch {
      // 上一次渲染已结束或已取消，忽略
    }
    const page = await doc.getPage(no)
    // 等待期间文档可能已被销毁
    if (!isCurrentDoc(doc) || renderedThumbs.has(no)) return
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: cssWidth / base.width })
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(viewport.width * ratio))
    canvas.height = Math.max(1, Math.floor(viewport.height * ratio))
    const task = page.render({
      canvas,
      viewport,
      optionalContentConfigPromise: ctx.getOcConfigPromise() ?? undefined,
      transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
    })
    thumbTasks.set(no, task)
    renderedThumbs.add(no)
    try {
      await task.promise
    } catch {
      // 渲染被取消属正常流程，静默忽略
    } finally {
      if (thumbTasks.get(no) === task) {
        thumbTasks.delete(no)
      }
      if (canvas.width === 0) {
        renderedThumbs.delete(no)
      }
    }
  }

  /**
   * 建立缩略图懒渲染观察器：进入侧栏可视区（含上下缓冲）才开始渲染
   */
  const setupThumbObserver = () => {
    thumbObserver?.disconnect()
    thumbObserver = null
    const root = thumbListRef.value
    if (!sidebarVisible.value || !root || !state.total) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const no = Number((entry.target as HTMLElement).dataset.page)
          if (no) renderThumb(no)
        }
      },
      { root, rootMargin: '400px 0px' }
    )
    for (const wrapper of thumbWrappers.values()) {
      observer.observe(wrapper)
    }
    thumbObserver = observer
  }

  watch(sidebarVisible, () => nextTick(setupThumbObserver))

  // 从目录切回缩略图时页面重新可见，需重建懒渲染观察器
  watch(sidebarTab, (tab) => {
    if (tab === 'thumb') nextTick(setupThumbObserver)
  })

  /**
   * 释放缩略图渲染资源（随文档销毁一起调用）
   */
  const destroyThumbs = () => {
    for (const task of thumbTasks.values()) {
      try {
        task.cancel()
      } catch {
        // 渲染已结束，忽略
      }
    }
    thumbTasks.clear()
    renderedThumbs.clear()
    thumbWrappers.clear()
    thumbObserver?.disconnect()
    thumbObserver = null
  }

  /**
   * 使已渲染缩略图失效（侧栏宽度变化/图层切换后需按新状态重绘）；保留观察器与容器引用
   */
  const invalidateThumbs = () => {
    for (const task of thumbTasks.values()) {
      try {
        task.cancel()
      } catch {
        // 渲染已结束，忽略
      }
    }
    thumbTasks.clear()
    renderedThumbs.clear()
    for (const wrapper of thumbWrappers.values()) {
      const canvas = wrapper.querySelector('canvas')
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
      }
    }
  }

  return { setThumbWrapper, setupThumbObserver, invalidateThumbs, destroyThumbs, thumbWrappers, renderedThumbs }
}
