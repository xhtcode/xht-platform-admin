<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { BellFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'

defineOptions({
  name: 'BpmnPanelAsync',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
const asyncBefore = ref<boolean>(false)
const asyncAfter = ref<boolean>(false)
const asyncExclusive = ref<boolean>(false)
const showExclusive = computed(() => asyncBefore.value || asyncAfter.value)
</script>

<template>
  <el-collapse-item name="bpmn-panel-async">
    <template #title>
      <bpmn-panel-title name="异步控制">
        <BellFilled />
      </bpmn-panel-title>
    </template>
    <el-form-item label="异步前" class="mb-0!">
      <el-switch v-model="asyncBefore" />
    </el-form-item>
    <el-form-item label="异步后" class="mb-0!">
      <el-switch v-model="asyncAfter" />
    </el-form-item>
    <el-form-item label="异步优先" class="mb-0!" v-if="showExclusive">
      <el-switch v-model="asyncExclusive" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
