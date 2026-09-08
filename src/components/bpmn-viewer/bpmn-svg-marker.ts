import BpmnViewer from 'bpmn-js/lib/Viewer'

/**
 * 向画布中添加一个节点-箭头颜色的实现
 * @param bpmnCanvas
 */
export function generateBpmnSvgMarker(bpmnCanvas: HTMLElement) {
  let bpmnSvg = bpmnCanvas.querySelector('.djs-container')?.querySelector('svg')
  // 取顶层 svg 的直接 defs，避免取到连线 djs-visual 内部的 defs 导致重绘后 marker 丢失
  let bpmnSvgDefs = bpmnSvg?.querySelector(':scope > defs')
  if (!bpmnSvgDefs) {
    bpmnSvgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    bpmnSvg?.appendChild(bpmnSvgDefs)
  }
  // 避免重复导入时生成重复 id 的 marker
  bpmnSvgDefs.querySelector('#greenMarker')?.remove()
  let marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
  if (marker) {
    marker.setAttribute('id', 'greenMarker')
    marker.setAttribute('viewBox', '0 0 20 20')
    marker.setAttribute('refX', '11')
    marker.setAttribute('refY', '10')
    marker.setAttribute('markerWidth', '10')
    marker.setAttribute('markerHeight', '10')
    marker.setAttribute('orient', 'auto')
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M 1 5 L 11 10 L 1 15 Z')
    path.setAttribute(
      'style',
      'fill: var(--bpmn-finished-color); stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: var(--bpmn-finished-color);'
    )
    marker.appendChild(path)
    bpmnSvgDefs?.appendChild(marker)
  }
}

/**
 * 删除画布中添加的节点-箭头颜色的实现
 */
export function removeBpmnPreviewModal() {
  let element = document.getElementById('greenMarker')
  element && element.parentNode && element.parentNode.removeChild(element)
}

/**
 * 为单个元素添加高亮类（对应样式见 bpmn.scss）
 * - 节点/连线主体统一通过 addMarker 添加 .highlight-* 状态类
 * - 网关的内部图案（如 X 图标）是 djs-visual 的第二个子元素，
 *   需额外加 highlight-gateway 类，由 CSS 组合选择器单独染色
 */
export function addNodeMarker(
  bpmnCanvas: any,
  elementRegistry: any,
  marker: 'highlight-finished-nodes' | 'highlight-finished-lines' | 'highlight-unfinished-tasks' | 'highlight-rejected-tasks',
  nodes: string[]
) {
  if (bpmnCanvas && elementRegistry && nodes && nodes.length > 0) {
    nodes.forEach((item) => {
      bpmnCanvas.addMarker(item, marker)
      const element = elementRegistry.get(item)
      if (element && /Gateway$/.test(element.type)) {
        bpmnCanvas.addMarker(item, 'highlight-gateway')
      }
    })
  }
}
