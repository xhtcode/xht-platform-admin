import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { LayerItem, OptionalContentConfig, PdfCoreContext } from './types'

/**
 * 图层模块返回值
 */
export interface LayersFeature {
  layers: Ref<LayerItem[]>
  layersLoading: Ref<boolean>
  loadLayers: (doc: PDFDocumentProxy) => Promise<void>
  toggleLayer: (layer: LayerItem) => Promise<void>
  /** 渲染需携带的图层配置 Promise */
  getOcConfigPromise: () => Promise<OptionalContentConfig> | null
  /** 文档销毁时释放图层配置 */
  resetOcConfig: () => void
}

/**
 * 创建图层（可选内容组）功能模块
 *
 * @param ctx 核心上下文
 */
export const createLayersFeature = (ctx: PdfCoreContext): LayersFeature => {
  // 注意：缩略图相关方法在缩略图模块装配后才补齐，必须通过 ctx 现取，不能在创建时解构
  const { isCurrentDoc, state, containerRef, findPageAtTop, refreshAfterScaleChange } = ctx

  const layers = ref<LayerItem[]>([])
  const layersLoading = ref(false)

  // 图层配置：渲染时需携带同一个配置对象，手动切换的可见性才会生效
  let ocConfig: OptionalContentConfig | null = null
  let ocConfigPromise: Promise<OptionalContentConfig> | null = null

  /**
   * 加载图层（可选内容组）；无图层时置空
   *
   * @param doc 已加载的文档代理
   */
  const loadLayers = async (doc: PDFDocumentProxy) => {
    layersLoading.value = true
    try {
      const config = await doc.getOptionalContentConfig()
      if (!isCurrentDoc(doc)) return
      ocConfig = config ?? null
      ocConfigPromise = config ? Promise.resolve(config) : null
      const list: LayerItem[] = []
      if (config) {
        for (const [id, group] of config) {
          const info = group as { name?: string; visible?: boolean } | null
          list.push({
            id: String(id),
            name: info?.name || '未命名图层',
            // 直接读组自身的 visible：config.isVisible() 接受的是可见性表达式对象，传组对象会恒为 true
            visible: info?.visible !== false,
          })
        }
      }
      layers.value = list
      // 首屏渲染时配置尚未就绪（按默认状态绘制），拿到配置后按当前滚动位置重绘一次
      if (list.length) {
        const container = containerRef.value
        refreshAfterScaleChange(container ? findPageAtTop(container.scrollTop) : state.current)
      }
    } catch (error) {
      console.error('PDF图层加载失败:', error)
      layers.value = []
    } finally {
      if (isCurrentDoc(doc)) layersLoading.value = false
    }
  }

  /**
   * 切换图层可见性并重绘
   *
   * @param layer 图层条目
   */
  const toggleLayer = async (layer: LayerItem) => {
    const config = ocConfig
    if (!config) return
    const visible = !layer.visible
    config.setVisibility(layer.id, visible)
    layer.visible = visible
    // 可见性只影响绘制结果：清空已有位图后按当前滚动位置重绘可见页与缩略图
    ctx.invalidateThumbs()
    const container = containerRef.value
    await refreshAfterScaleChange(container ? findPageAtTop(container.scrollTop) : state.current)
    ctx.setupThumbObserver()
  }

  const getOcConfigPromise = () => ocConfigPromise

  const resetOcConfig = () => {
    ocConfig = null
    ocConfigPromise = null
  }

  return { layers, layersLoading, loadLayers, toggleLayer, getOcConfigPromise, resetOcConfig }
}
