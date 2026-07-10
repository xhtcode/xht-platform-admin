<script setup lang="ts">
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { Document } from '@element-plus/icons-vue'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useDocumentationHooks } from '@/components/bpmn-editor/components/bpmn.documentation.hooks'
defineOptions({
  name: 'BpmnPanelDocument',
})
const { getDocumentValue, setDocumentValue } = useDocumentationHooks()
const bpmnStore = useBpmnStore()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
const elementDoc = ref<string>()

onMounted(() => {
  elementDoc.value = getDocumentValue(activeElement.value) || ''
})
watch(
  () => activeElementId.value,
  () => {
    elementDoc.value = getDocumentValue(activeElement.value) || ''
  }
)
</script>

<template>
  <el-collapse-item name="bpmn-panel-document">
    <template #title>
      <bpmn-panel-title name="文档设置">
        <Document />
      </bpmn-panel-title>
    </template>
    <el-form-item label="文档内容">
      <el-input
        v-model="elementDoc"
        type="textarea"
        :rows="5"
        resize="none"
        placeholder="请输入文档内容"
        @change="setDocumentValue(activeElement, elementDoc)"
      />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
