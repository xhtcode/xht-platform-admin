/**
 * PDF 文本层选择范围修正：移植 pdf.js 官方 viewer 的 endOfContent 机制。
 *
 * 背景：Chromium（旧内核尤甚，国产浏览器多为 86~120 内核）在文本层空白处
 * 拖拽选择时，会把选择端点跳到文本层末尾，导致「选中标题却带出一大片下方
 * 内容」的多选问题。官方 viewer 的解法：
 * 1. 渲染完成后在文本层末尾追加一个 endOfContent 占位元素（默认位于层外底部）；
 * 2. mousedown 时给文本层加 `selecting` 类，让 endOfContent 瞬间盖住整个层，
 *    空白区域的拖拽命中它（user-select: none）而不再误锚定远处文本；
 * 3. 旧内核浏览器上，selectionchange 时把 endOfContent 移动到选择锚点旁并
 *    撑满整层，约束选择边界不越过锚点所在层（新版内核已原生修复，跳过）。
 */

/** 文本层 div → 对应的 endOfContent 元素与事件清理器 */
const boundLayers = new Map<HTMLDivElement, { end: HTMLDivElement; abort: () => void }>()

let controller: AbortController | null = null
let pointerDown = false
let prevRange: Range | null = null
/** null 表示尚未探测浏览器能力；true 表示新内核原生修复，无需移动 endOfContent */
let nativeFixed: boolean | null = null

const resetLayer = (end: HTMLDivElement, layer: HTMLDivElement) => {
  layer.append(end)
  end.style.width = ''
  end.style.height = ''
  end.style.userSelect = ''
  layer.classList.remove('selecting')
}

const resetAll = () => {
  for (const [layer, { end }] of boundLayers) resetLayer(end, layer)
}

/** 探测是否为新内核浏览器（已原生修复空白拖拽多选），是则无需移动 endOfContent */
const detectNativeFixed = (layer: HTMLDivElement): boolean => {
  // Firefox 的 -moz-user-select 在文本层上为 none，走原生行为
  if (getComputedStyle(layer).getPropertyValue('-moz-user-select') === 'none') return true
  const brands = (navigator as unknown as { userAgentData?: { brands?: { brand: string; version: string }[] } }).userAgentData?.brands
  const chromium = brands?.find((item) => item.brand === 'Chromium')?.version ?? /\bChrome\/(\d+)\b/.exec(navigator.userAgent)?.[1]
  return !!chromium && Number.parseInt(chromium, 10) >= 148
}

const handleSelectionChange = () => {
  const selection = document.getSelection()
  if (!selection || selection.rangeCount === 0) {
    resetAll()
    return
  }
  // 与当前选择相交的文本层进入 selecting 状态，其余复位
  const active = new Set<HTMLDivElement>()
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i)
    for (const layer of boundLayers.keys()) {
      if (!active.has(layer) && range.intersectsNode(layer)) active.add(layer)
    }
  }
  for (const [layer, { end }] of boundLayers) {
    if (active.has(layer)) layer.classList.add('selecting')
    else resetLayer(end, layer)
  }
  if (nativeFixed === null) {
    const first = boundLayers.keys().next().value
    nativeFixed = !first || detectNativeFixed(first)
  }
  if (nativeFixed) return
  // 旧内核：把 endOfContent 移动到选择锚点旁，撑满整层以约束选择边界
  const range = selection.getRangeAt(0)
  const modifyStart = !!prevRange && (range.compareBoundaryPoints(Range.END_TO_END, prevRange) === 0 || range.compareBoundaryPoints(Range.START_TO_END, prevRange) === 0)
  let anchor: Node = modifyStart ? range.startContainer : range.endContainer
  if (anchor.nodeType === Node.TEXT_NODE) anchor = anchor.parentNode as Node
  if (!modifyStart && range.endOffset === 0) {
    do {
      while (!anchor.previousSibling) anchor = anchor.parentNode as Node
      anchor = anchor.previousSibling
    } while (!anchor.childNodes.length)
  }
  const parentLayer = (anchor as Element).parentElement?.closest('.xht-pdf-preview__text-layer') as HTMLDivElement | null
  const bound = parentLayer ? boundLayers.get(parentLayer) : undefined
  if (parentLayer && bound) {
    bound.end.style.width = parentLayer.style.width
    bound.end.style.height = parentLayer.style.height
    bound.end.style.userSelect = 'text'
    ;(anchor as Element).parentElement?.insertBefore(bound.end, modifyStart ? anchor : anchor.nextSibling)
  }
  prevRange = range.cloneRange()
}

/**
 * 为渲染完成的文本层挂接选择边界修正
 *
 * @param div pdf.js TextLayer 的容器（组件文本层 div）
 */
export const attachTextLayerSelection = (div: HTMLDivElement): void => {
  if (boundLayers.has(div)) return
  const end = document.createElement('div')
  end.className = 'endOfContent'
  div.append(end)
  const layerController = new AbortController()
  div.addEventListener(
    'mousedown',
    () => {
      div.classList.add('selecting')
    },
    { signal: layerController.signal },
  )
  boundLayers.set(div, { end, abort: () => layerController.abort() })
  if (!controller) {
    controller = new AbortController()
    const { signal } = controller
    document.addEventListener('pointerdown', () => {
      pointerDown = true
    }, { signal })
    document.addEventListener(
      'pointerup',
      () => {
        pointerDown = false
        resetAll()
      },
      { signal },
    )
    window.addEventListener('blur', () => {
      pointerDown = false
      resetAll()
    }, { signal })
    document.addEventListener('keyup', () => {
      if (!pointerDown) resetAll()
    }, { signal })
    document.addEventListener('selectionchange', handleSelectionChange, { signal })
  }
}

/**
 * 文本层销毁时解除挂接（元素与监听一并清理）
 *
 * @param div pdf.js TextLayer 的容器
 */
export const detachTextLayerSelection = (div: HTMLDivElement): void => {
  const bound = boundLayers.get(div)
  if (!bound) return
  boundLayers.delete(div)
  bound.abort()
  bound.end.remove()
  div.classList.remove('selecting')
  if (boundLayers.size === 0 && controller) {
    controller.abort()
    controller = null
    prevRange = null
    nativeFixed = null
  }
}
