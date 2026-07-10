<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { getBpmnElementInfo } from '@/utils/bpmn'
import BpmnPanelBasic from '@/components/bpmn-editor/components/bpmn-panel-basic.vue'
import BpmnPanelDocument from '@/components/bpmn-editor/components/bpmn-panel-document.vue'
import BpmnPanelListenerExecution from '@/components/bpmn-editor/components/bpmn-panel-listener-execution.vue'
import BpmnPanelProperties from '@/components/bpmn-editor/components/bpmn-panel-properties.vue'
import BpmnPanelUser from '@/components/bpmn-editor/components/bpmn-panel-user.vue'
import BpmnPanelListenerTask from '@/components/bpmn-editor/components/bpmn-panel-listener-task.vue'
import BpmnPanelAsync from '@/components/bpmn-editor/components/bpmn-panel-async.vue'
import BpmnPanelUserCopy from '@/components/bpmn-editor/components/bpmn-panel-user-copy.vue'

defineOptions({
  name: 'BpmnPanelIndex',
})
const bpmnStore = useBpmnStore()

const formInfo = shallowRef({})
const activeNames = ref()
const elementInfo = computed<BpmnElementInfo>(() => {
  return getBpmnElementInfo(bpmnStore.activeElement)
})
</script>

<template>
  <el-form label-width="50px" label-position="top" v-model="formInfo" size="default">
    <el-collapse v-model="activeNames">
      <el-collapse-item disabled name="panelInfo">
        <template #title>
          <div class="bpmn-panel-title">{{ elementInfo.name }}</div>
        </template>
        <template #icon>
          <el-tag>{{ elementInfo.rawElementType }}</el-tag>
        </template>
      </el-collapse-item>
      <bpmn-panel-basic :element-info="elementInfo" />
      <bpmn-panel-user />
      <bpmn-panel-user-copy />
      <bpmn-panel-listener-execution />
      <bpmn-panel-listener-task />
      <bpmn-panel-properties />
      <bpmn-panel-document />
      <bpmn-panel-async />
    </el-collapse>
  </el-form>
</template>

<style scoped lang="scss">
.bpmn-panel-title {
  color: var(--el-color-black) !important;
  font-weight: bold;
}
</style>
