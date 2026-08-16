<script setup lang="ts">
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { Share } from '@element-plus/icons-vue'

defineOptions({
  name: 'BpmnPanelCondition',
  inheritAttrs: false,
})
/**
 * 条件类型
 */
const conditionType = ref<'normal' | 'default' | 'expression'>('normal')
/**
 * 表达式
 */
const conditionValue = ref<string>('')
/**
 * 条件类型改变
 */
const conditionTypeChange = () => {
  conditionValue.value = ''
}
</script>

<template>
  <el-collapse-item name="bpmn-panel-condition">
    <template #title>
      <bpmn-panel-title name="流转条件">
        <Share />
      </bpmn-panel-title>
    </template>
    <el-form-item label="条件类型" class="mb-2!">
      <el-radio-group v-model="conditionType" @change="conditionTypeChange">
        <el-radio-button label="普通" value="normal" />
        <el-radio-button label="默认" value="default" />
        <el-radio-button label="条件" value="expression" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="表达式" class="mb-0!">
      <el-input
        v-model="conditionValue"
        type="textarea"
        :rows="3"
        resize="none"
        clearable
        :maxlength="200"
        show-word-limit
        placeholder="请输入表达式"
      />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
