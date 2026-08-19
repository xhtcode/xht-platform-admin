<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { Back, Refresh, Right } from '@element-plus/icons-vue'
import CommandStack from 'diagram-js/lib/command/CommandStack'
import { useBpmnHooks } from '@/hooks/use.bpmn'
import bpmnXML from '@/components/bpmn-editor/bpmn-template'
import { generateUUID } from '@/utils'
import { useMessageBox } from '@/hooks/use-message'

defineOptions({
  name: 'BpmnToolbarCommand',
})

const bpmnStore = useBpmnStore()
const { importXML } = useBpmnHooks()
const { modeler } = storeToRefs(bpmnStore)
const command = computed(() => modeler.value?.get<CommandStack>('commandStack'))
const loadingStatus = ref<boolean>(false)

/**
 * 上一步
 */
const undo = () => {
  command.value && command.value?.canUndo() && command.value?.undo()
}
/**
 * 下一步
 */
const redo = () => {
  command.value && command.value?.canRedo() && command.value?.redo()
}
/**
 * 重置
 */
const restart = async () => {
  useMessageBox()
    .confirm('是否重置流程，这样将丢失当前数据？')
    .then(() => {
      loadingStatus.value = true
      command.value && command.value?.clear()
      importXML(bpmnXML(generateUUID(), '测试流程')).finally(() => {
        loadingStatus.value = false
      })
    })
    .catch(() => {})
}
</script>

<template>
  <el-button-group type="primary" size="default">
    <el-tooltip content="上一步" placement="bottom">
      <el-button @click="undo">
        <el-icon size="16px"><Back /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="重置" placement="bottom">
      <el-button @click="restart" :loading="loadingStatus">
        <el-icon size="16px"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="下一步" placement="bottom">
      <el-button @click="redo">
        <el-icon size="16px"><Right /></el-icon>
      </el-button>
    </el-tooltip>
  </el-button-group>
</template>

<style scoped lang="scss"></style>
