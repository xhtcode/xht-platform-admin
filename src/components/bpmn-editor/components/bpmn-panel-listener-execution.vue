<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { BellFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelListenerExecution',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
</script>

<template>
  <el-collapse-item name="bpmn-panel-listener-execution">
    <template #title>
      <bpmn-panel-title name="执行监听器">
        <BellFilled />
      </bpmn-panel-title>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
