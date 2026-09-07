<script setup lang="ts">
import '@/styles/theme/bpmn.scss'
import 'bpmn-js/dist/assets/diagram-js.css' // 基础样式
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import GridLineModule from 'diagram-js-grid-bg' // 网格背景模块
import defaultData from '@/components/bpmn-viewer/data'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import { House, Minus, Plus } from '@element-plus/icons-vue'
defineOptions({
  name: 'BpmnViewer',
})
const attrs = useAttrs()
const canvas = useTemplateRef<HTMLElement>('canvas')
onMounted(() => {
  initModeler(canvas.value!)
})
const defaultZoom = ref(0)
let bpmnViewer: BpmnViewer<null> | null = null
const initModeler = (canvas: HTMLElement) => {
  bpmnViewer && bpmnViewer.destroy()
  bpmnViewer = new BpmnViewer({
    container: canvas,
    width: '100%',
    additionalModules: [
      MoveCanvasModule, // 移动整个画布
      GridLineModule,
    ],
    gridLine: {
      smallGridSpacing: 10, // 最小网格边长
      gridSpacing: 40, // 大号网格边长
      gridLineStroke: 0.5, // 网格边框宽度
      gridLineOpacity: 0.4, // 网格边框透明度
      gridLineColor: 'var(--el-color-info-light-5)', // 网格边框颜色
    },
  })
  importXml()
  bpmnViewer.on('element.click', ({ element }) => {
    console.log(element)
  })
}
function importXml() {
  bpmnViewer?.importXML(defaultData.xml).then(() => {
    const canvas = bpmnViewer!.get<any>('canvas')
    bpmnViewer!.get<any>('canvas').zoom('fit-viewport', 'auto')
    defaultZoom.value = canvas?.zoom()
    fitViewScaleRate.value = canvas.zoom()
    const finishedNodes = defaultData.finishedNodes
    const finishedLines = defaultData.finishedLines
    const unfinishedTasks = defaultData.unfinishedTasks
    const rejectedTasks = defaultData.rejectedTasks
    const elementRegistry = bpmnViewer!.get<any>('elementRegistry')
    // 高亮节点：网关内部图案（djs-visual 第二个子元素）需额外加类单独高亮
    const addNodeMarker = (item: string, marker: string) => {
      canvas.addMarker(item, marker)
      const element = elementRegistry.get(item)
      if (element && /Gateway$/.test(element.type)) {
        canvas.addMarker(item, 'highlight-gateway')
      }
      // 外部文字（如开始事件、网关的 name）是独立的 label 元素（id 为 `${item}_label`），
      // 需加独立类高亮，避免与节点主体的 > :nth-child(1) 规则冲突
      const label = elementRegistry.get(`${item}_label`)
      if (label) {
        canvas.addMarker(label, `${marker}-label`)
      }
    }
    if (finishedNodes && finishedNodes.length > 0) {
      finishedNodes.forEach((item) => {
        addNodeMarker(item, 'highlight-finished-nodes')
      })
    }
    if (finishedLines && finishedLines.length > 0) {
      finishedLines.forEach((item) => {
        canvas.addMarker(item, 'highlight-finished-lines')
        // 连线文字是独立的 label 元素（id 为 `${item}_label`），需单独添加高亮类
        const label = elementRegistry.get(`${item}_label`)
        if (label) {
          canvas.addMarker(label, 'highlight-finished-lines')
        }
      })
    }
    if (unfinishedTasks && unfinishedTasks.length > 0) {
      unfinishedTasks.forEach((item) => {
        addNodeMarker(item, 'highlight-unfinished-tasks')
      })
    }
    if (rejectedTasks && rejectedTasks.length > 0) {
      rejectedTasks.forEach((item) => {
        addNodeMarker(item, 'highlight-rejected-tasks')
      })
    }
    genBpmnSvgMarker()
  })
}

const fitViewScaleRate = ref(1)
const isFitView = ref(false)
const processZoomOut = () => {}
const processFitDialog = (isFitView: boolean) => {
  console.log(isFitView)
}
const processZoomIn = () => {}

// 向画布中添加一个节点-箭头颜色的实现
function genBpmnSvgMarker() {
  // 向画布中添加一个节点-箭头颜色的实现
  let bpmnCanvas = canvas.value!
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
// 解决生成多个箭头标签的BUG
function onCloseBpmnPreviewModal() {
  let element = document.getElementById('greenMarker')
  element?.parentNode?.removeChild(element)
}
onUnmounted(() => {
  bpmnViewer?.destroy()
  onCloseBpmnPreviewModal()
})
</script>

<template>
  <div class="bpmn-viewer-container" v-bind="attrs">
    <div class="svg-controller">
      <div class="scale-rate">
        {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
      </div>
      <el-space>
        <el-button title="缩小" shape="circle" size="small" @click="processZoomOut()" type="primary">
          <el-icon><Minus /></el-icon>
        </el-button>
        <el-button :title="isFitView ? '按窗口大小显示' : '实际大小'" shape="circle" size="small" @click="processFitDialog(isFitView)" type="primary">
          <el-icon>
            <House v-if="isFitView" />
            <House v-else />
          </el-icon>
        </el-button>
        <el-button title="放大" shape="circle" size="small" @click="processZoomIn()" type="primary">
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-space>
    </div>
    <div class="h-full w-full bpmnCanvas canvas" ref="canvas"></div>
  </div>
</template>
