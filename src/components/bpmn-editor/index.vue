<script setup lang="ts">
import '@/styles/theme/bpmn.scss'
import 'bpmn-js/dist/assets/diagram-js.css' // 基础样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css' // 节点基础图标
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css' // 少量特殊符号编码补充
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css' // base64 内嵌完整字体，一体文件
import 'diagram-js-minimap/assets/diagram-js-minimap.css' // 小地图
import bpmnXML from '@/components/bpmn-editor/bpmn-template'
import BpmnPanelIndex from '@/components/bpmn-editor/components/bpmn-panel-index.vue'
import { useBpmnHooks } from '@/hooks/use.bpmn'
import BpmnToolbarAlign from '@/components/bpmn-editor/components/bpmn-toolbar-align.vue'
import BpmnToolbarZoom from '@/components/bpmn-editor/components/bpmn-toolbar-zoom.vue'
import BpmnToolbarCommand from '@/components/bpmn-editor/components/bpmn-toolbar-command.vue'
import BpmnToolbarBasic from '@/components/bpmn-editor/components/bpmn-toolbar-basic.vue'
import BpmnToolbarMenu from '@/components/bpmn-editor/components/bpmn-toolbar-menu.vue'

defineOptions({
  name: 'BpmnEditor',
  inheritAttrs: false,
})

const canvas = useTemplateRef<HTMLElement>('canvas')
const { importXML, initModeler } = useBpmnHooks()
const panelMenu = ref<boolean>(true)
onMounted(() => {
  initModeler(canvas.value!)
  importXML(bpmnXML('NewDemo', 'NewDemo'))
})
</script>

<template>
  <el-container class="process-container">
    <el-header class="process-header">
      <bpmn-toolbar-basic />
      <bpmn-toolbar-align />
      <bpmn-toolbar-zoom />
      <bpmn-toolbar-command />
      <bpmn-toolbar-menu v-model:panel-menu="panelMenu" />
    </el-header>
    <el-container class="process-container-main">
      <el-main class="process-main">
        <div class="bpmn-container" ref="canvas"></div>
      </el-main>
      <el-aside class="process-panel" v-show="panelMenu">
        <BpmnPanelIndex />
      </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.process-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  --process-padding: 10px;
  .process-header {
    height: 45px;
    padding: 0 calc(var(--process-padding) * 2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--xht-border-color);
    overflow: hidden;
    gap: 1rem;
  }
  .process-container-main {
    height: calc(100% - 45px);
  }
  .process-main {
    padding: 0;
    overflow: hidden;
    .bpmn-container {
      height: 100%;
      width: 100%;
    }
  }
  .process-panel {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    padding: 0 var(--process-padding) 100px var(--process-padding);
    width: 25vw;
    border-left: 1px solid var(--xht-border-color);
  }
}
</style>
