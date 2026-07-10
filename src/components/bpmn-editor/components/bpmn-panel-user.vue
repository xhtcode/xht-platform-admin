<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { UserFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelUser',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
</script>

<template>
  <el-collapse-item name="bpmn-panel-user">
    <template #title>
      <bpmn-panel-title name="用户分配">
        <UserFilled />
      </bpmn-panel-title>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
