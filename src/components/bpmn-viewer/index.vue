<script setup lang="ts">
import { Element } from 'bpmn-js/lib/util/ModelUtil'
import '@/styles/theme/bpmn.scss' // 流程高亮样式（.highlight-* 系列）
import 'bpmn-js/dist/assets/diagram-js.css' // 基础样式
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas' // 拖拽空白区域平移画布
import GridLineModule from 'diagram-js-grid-bg' // 网格背景模块
import defaultData from '@/components/bpmn-viewer/data' // 演示流程 XML 及节点/连线高亮数据
import BpmnViewer from 'bpmn-js/lib/Viewer' // 只读流程查看器
import { Minus, Plus } from '@element-plus/icons-vue' // 缩小 / 放大图标
import { addNodeMarker, generateBpmnSvgMarker, removeBpmnPreviewModal } from '@/components/bpmn-viewer/bpmn-svg-marker' // 箭头 marker 的注入与清理
defineOptions({
  name: 'BpmnViewer',
  inheritAttrs: false,
})
const attrs = useAttrs() // 外部传入的属性透传到根节点容器
const defaultZoom = ref<number>(0) // 当前画布缩放倍率（驱动按钮组缩放与百分比显示）
const fitViewScaleRate = ref<number>(1) // 初始记录适配视口后的缩放倍率
const bpmnViewerRef = useTemplateRef<HTMLElement>('bpmnViewerRef') // 画布挂载容器
const bpmnViewer = shallowRef<BpmnViewer>() // 查看器实例（shallowRef 避免大对象深层响应式开销）
const bpmnCanvas = shallowRef<any>() // diagram-js canvas 服务：控制缩放、addMarker 添加高亮类
const lastClickElementId = shallowRef<string>('') // 点击选中的节点 id（切换或取消选中时需移除上一次的高亮）

/**
 * 初始化（或重建）只读流程查看器
 * @param canvas 画布挂载的 DOM 元素
 */
const initModeler = (canvas: HTMLElement) => {
  bpmnViewer.value && bpmnViewer.value.destroy() // 已有实例时先销毁，避免重复挂载
  bpmnViewer.value = new BpmnViewer({
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
  // 导入流程数据并执行状态高亮
  importXml()
  // 再次点击同一节点或点击连线/文字时取消选中，点击其他节点则切换选中对象
  bpmnViewer.value!.on('element.click', (event: any) => {
    const element = event.element as Element
    // 移除上一次选中的高亮（旧元素可能已随流程重新导入失效，先确认存在再移除）
    if (lastClickElementId.value) {
      bpmnCanvas.value.removeMarker(lastClickElementId.value, 'highlight-node-selected')
    }
    lastClickElementId.value = ''
    if (element.type === 'bpmn:Process') {
      return
    }
    // 点击的仍是上次选中的节点：仅移除高亮完成取消，不再重复添加
    if (element.id === lastClickElementId.value) {
      return
    }
    if (defaultData.all && defaultData.all.includes(element.id)) {
      bpmnCanvas.value.addMarker(element.id, 'highlight-node-selected')
      lastClickElementId.value = element.id
    }
  })
  bpmnCanvas.value = bpmnViewer.value!.get<any>('canvas') // 缓存 canvas 服务，供缩放与高亮使用
  // 注入绿色箭头 marker（#greenMarker），供已完成连线样式的 marker-end: url(#greenMarker) 引用
  generateBpmnSvgMarker(bpmnViewerRef.value!)
}

/**
 * 导入流程 XML（异步），完成后自动适配视口并按数据配置高亮节点与连线
 */
function importXml() {
  bpmnViewer.value?.importXML(defaultData.xml).then(() => {
    lastClickElementId.value = '' // 重新导入后画布整体重建，清除上一次点击选中记录
    bpmnCanvas.value.zoom('fit-viewport', { x: 0, y: 0 }) // 画布内容自适应视口并居中
    defaultZoom.value = bpmnCanvas.value.zoom()
    fitViewScaleRate.value = bpmnCanvas.value.zoom()
    const elementRegistry = bpmnViewer.value!.get<any>('elementRegistry')
    // 已完成节点：绿色边框 + 半透明绿色背景
    addNodeMarker(bpmnCanvas.value, elementRegistry, 'highlight-finished-nodes', defaultData.finishedNodes)
    // 已完成连线：绿色线条 + 绿色箭头
    addNodeMarker(bpmnCanvas.value, elementRegistry, 'highlight-finished-lines', defaultData.finishedLines)
    // 待办任务：橙色虚线流动边框
    addNodeMarker(bpmnCanvas.value, elementRegistry, 'highlight-unfinished-tasks', defaultData.unfinishedTasks)
    // 已驳回任务：红色边框
    addNodeMarker(bpmnCanvas.value, elementRegistry, 'highlight-rejected-tasks', defaultData.rejectedTasks)
  })
}

/**
 * 缩小：每次按 zoomStep（默认 0.1）递减，最小不低于 0.2 倍
 * @param zoomStep 步长
 */
const processZoomOut = (zoomStep = 0.05) => {
  if (bpmnCanvas.value) {
    // 先乘 100 取整再除回，避免浮点累加导致比例显示误差
    let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
    if (newZoom < 0.2) {
      newZoom = 0.2
    }
    defaultZoom.value = newZoom
    bpmnCanvas.value.zoom(defaultZoom.value)
  }
}

/**
 * 一键适配视口：将整张流程图缩放至全部可见
 */
const processFitDialog = () => {
  if (bpmnCanvas.value) {
    bpmnCanvas.value.zoom('fit-viewport', 'auto')
    defaultZoom.value = bpmnCanvas.value.zoom()
  }
}

/**
 * 放大：每次按 zoomStep（默认 0.1）递增，最大不超过 4 倍
 * @param zoomStep 步长
 */
const processZoomIn = (zoomStep = 0.05) => {
  if (bpmnCanvas.value) {
    let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
    if (newZoom > 4) {
      newZoom = 4
    }
    defaultZoom.value = newZoom
    bpmnCanvas.value.zoom(defaultZoom.value)
  }
}

onMounted(() => {
  initModeler(bpmnViewerRef.value!) // 挂载完成后初始化查看器
})

onUnmounted(() => {
  bpmnViewer.value?.destroy() // 销毁查看器，释放画布 DOM
  removeBpmnPreviewModal() // 移除注入的箭头 marker，避免下次挂载出现重复 id
})
</script>

<template>
  <div class="bpmn-viewer-container" v-bind="attrs">
    <!-- 缩放工具条：悬浮于画布右上角（定位见 bpmn.scss .bpmn-viewer-tool） -->
    <div class="bpmn-viewer-tool">
      <div class="scale-rate"></div>
      <el-button-group>
        <!-- 缩小（步长 0.1） -->
        <el-button size="small" @click="processZoomOut()" type="primary">
          <el-icon><Minus /></el-icon>
        </el-button>
        <!-- 显示当前缩放比例，点击一键适配视口 -->
        <el-button size="small" @click="processFitDialog()">
          {{ Math.floor(defaultZoom * 10 * 10) + '%' }}
        </el-button>
        <!-- 放大（步长 0.1） -->
        <el-button size="small" @click="processZoomIn()" type="primary">
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-button-group>
    </div>
    <div class="h-full w-ful" ref="bpmnViewerRef"></div>
  </div>
</template>
