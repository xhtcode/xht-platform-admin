<script setup lang="ts">
import '@/styles/theme/bpmn.scss'
import 'bpmn-js/dist/assets/diagram-js.css' // 基础样式
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import GridLineModule from 'diagram-js-grid-bg' // 网格背景模块
import defaultData from '@/components/bpmn-viewer/data'
import BpmnViewer from 'bpmn-js/lib/Viewer'
import { House, Minus, Plus } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message'
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
    const elementRegistry = bpmnViewer!.get<any>('elementRegistry')
    if (finishedNodes && finishedNodes.length > 0) {
      finishedNodes.forEach((item) => {
        canvas.addMarker(item, 'highlight-finished-nodes')
      })
    }
    if (finishedLines && finishedLines.length > 0) {
      finishedLines.forEach((item) => {
        canvas.addMarker(item, 'highlight-finished-lines')
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
  let bpmnSvgDefs = bpmnSvg?.querySelector('defs')
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
    path.setAttribute('style', 'fill: red; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: #00be00;')
    marker.appendChild(path)
    bpmnSvgDefs?.appendChild(marker)
  }
}
// 解决生成多个箭头标签的BUG
function onCloseBpmnPreviewModal() {
  let element = document.getElementById('greenMarker')
  element?.parentNode?.removeChild(element)
}
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
