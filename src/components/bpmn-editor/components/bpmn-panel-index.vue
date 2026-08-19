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

defineOptions({
  name: 'BpmnPanelIndex',
})
const bpmnStore = useBpmnStore()
const { activeElement, activePanelName } = storeToRefs(bpmnStore)
const formInfo = shallowRef({})
const elementInfo = computed<BpmnElementInfo>(() => {
  return getBpmnElementInfo(activeElement.value)
})
const isShowTask = computed<boolean>(() => {
  return activeElement.value?.type.indexOf('Task') !== -1
})
const isShowUserTask = computed<boolean>(() => {
  return elementInfo.value.elementType === 'UserTask'
})
const isConditionShow = computed<boolean>(
  () =>
    activeElement.value?.type === 'bpmn:SequenceFlow' && activeElement.value?.source && activeElement.value?.source.type.indexOf('StartEvent') === -1
)
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
          <bpmn-panel-condition v-if="isConditionShow" />
          <bpmn-panel-user v-if="isShowUserTask" />
          <bpmn-panel-user-copy v-if="isShowUserTask" />
          <bpmn-panel-listener-execution />
          <bpmn-panel-listener-task v-if="isShowUserTask" />
          <bpmn-panel-loop v-if="isShowUserTask" />
          <bpmn-panel-properties />
          <bpmn-panel-async v-if="isShowTask" />
          <bpmn-panel-document />
        </el-collapse>
      </el-scrollbar>
    </el-form>
  </div>
</template>
