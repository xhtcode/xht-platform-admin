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
import BpmnPanelLoop from '@/components/bpmn-editor/components/bpmn-panel-loop.vue'
import BpmnPanelCondition from '@/components/bpmn-editor/components/bpmn-panel-condition.vue'
import { storeToRefs } from 'pinia'
import bpmnPanelData from '@/components/bpmn-editor/bpmn-panel.data'

defineOptions({
  name: 'BpmnPanelIndex',
})
const bpmnStore = useBpmnStore()
const { activeElement, activePanelName } = storeToRefs(bpmnStore)
const formInfo = shallowRef({})
const elementInfo = computed<BpmnElementInfo>(() => {
  return getBpmnElementInfo(activeElement.value)
})
/**
 * 获取当前元素的面板元素
 */
const panelElement = computed<PanelElementType[]>(() => {
  return bpmnPanelData[activeElement.value?.type || 'bpmn:Process'] || []
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between p-3">
      <div class="font-bold text-[16px]">{{ elementInfo.name }}</div>
      <el-tag>{{ elementInfo.rawElementType }}</el-tag>
    </div>
    <el-form label-width="100px" v-model="formInfo" size="default" class="flex-1 flex overflow-hidden">
      <el-scrollbar class="w-full" view-class="flex-1 pl-5 pr-5" always>
        <el-collapse v-model="activePanelName">
          <bpmn-panel-basic :element-info="elementInfo" />
          <bpmn-panel-condition v-if="panelElement.includes('bpmn-panel-condition')" />
          <bpmn-panel-user v-if="panelElement.includes('bpmn-panel-user')" />
          <bpmn-panel-user-copy v-if="panelElement.includes('bpmn-panel-user-copy')" />
          <bpmn-panel-listener-execution v-if="panelElement.includes('bpmn-panel-listener-execution')" />
          <bpmn-panel-listener-task v-if="panelElement.includes('bpmn-panel-listener-task')" />
          <bpmn-panel-loop v-if="panelElement.includes('bpmn-panel-loop')" />
          <bpmn-panel-properties v-if="panelElement.includes('bpmn-panel-properties')" />
          <bpmn-panel-async v-if="panelElement.includes('bpmn-panel-async')" />
          <bpmn-panel-document v-if="panelElement.includes('bpmn-panel-document')" />
        </el-collapse>
      </el-scrollbar>
    </el-form>
  </div>
</template>
