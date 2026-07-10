<script setup lang="ts">
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { useBpmnHooks } from '@/hooks/use.bpmn'
import { Grid } from '@element-plus/icons-vue'
import type { BpmnPanelProps } from '@/components/bpmn-editor/bpmn.model'

defineOptions({
  name: 'BpmnPanelBasic',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<BpmnPanelProps>(), {
  elementInfo: {},
})
const { bpmnRef } = useBpmnHooks()
const id = bpmnRef('id')
const name = bpmnRef('name')
const initiator = bpmnRef('initiator')
const startEvent = computed(() => props.elementInfo?.elementType === 'StartEvent' || false)
</script>

<template>
  <el-collapse-item name="bpmn-panel-basic">
    <template #title>
      <bpmn-panel-title name="常规信息">
        <Grid />
      </bpmn-panel-title>
    </template>
    <el-form-item label="id">
      <el-input v-model="id" placeholder="请输入id" />
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="name" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="发起人" v-if="startEvent">
      <el-input v-model="initiator" placeholder="请输入发起人" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
