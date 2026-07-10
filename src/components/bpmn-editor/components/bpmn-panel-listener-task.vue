<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { BellFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelListenerTask',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
</script>

<template>
  <el-collapse-item name="bpmn-panel-listener-task">
    <template #title>
      <bpmn-panel-title name="任务监听器">
        <BellFilled />
      </bpmn-panel-title>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
