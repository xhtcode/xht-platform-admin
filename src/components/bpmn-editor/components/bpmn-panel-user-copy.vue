<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { UserFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelUserCopy',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
</script>

<template>
  <el-collapse-item name="bpmn-panel-user-copy">
    <template #title>
      <bpmn-panel-title name="抄送配置">
        <UserFilled />
      </bpmn-panel-title>
    </template>
    <el-alert type="error" :closable="false">暂未实现</el-alert>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
