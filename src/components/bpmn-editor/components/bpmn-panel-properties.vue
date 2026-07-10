<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { BellFilled, Briefcase } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelProperties',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
</script>

<template>
  <el-collapse-item name="bpmn-panel-properties">
    <template #title>
      <bpmn-panel-title name="扩展属性">
        <Briefcase />
      </bpmn-panel-title>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
