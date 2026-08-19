<script setup lang="ts">
import { HelpFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { useBpmnLoopHooks } from '@/components/bpmn-editor/components/bpmn.loop.hooks'

defineOptions({
  name: 'BpmnPanelLoop',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElementId } = storeToRefs(bpmnStore)
const { getLoopType, getLoopProperties, updateLoopType, updateLoopProperties } = useBpmnLoopHooks()
/**
 * 多实例类型
 */
const loopType = ref<'none' | 'parallel' | 'sequential'>('none')
/**
 * 基数
 */
const loopCardinality = ref<string>('')
/**
 * 集合
 */
const loopCollection = ref<string>('')
/**
 * 元素变量
 */
const loopVariable = ref<string>('')
/**
 * 完成条件
 */
const loopCompletionCondition = ref<string>('')

/**
 * 初始化多实例属性
 */
const initLoopProperties = () => {
  loopType.value = getLoopType()
  const loopProperties = getLoopProperties()
  loopCardinality.value = loopProperties.loopCardinality
  loopCollection.value = loopProperties.loopCollection
  loopVariable.value = loopProperties.loopVariable
  loopCompletionCondition.value = loopProperties.loopCompletionCondition
}

/**
 * 多实例类型改变
 */
const loopTypeChange = () => {
  updateLoopType(loopType.value)
  loopCardinality.value = ''
  loopCollection.value = ''
  loopVariable.value = ''
  loopCompletionCondition.value = ''
  updateLoopProperties({
    loopCardinality: loopCardinality.value,
    loopCollection: loopCollection.value,
    loopVariable: loopVariable.value,
    loopCompletionCondition: loopCompletionCondition.value,
  })
}

/**
 * 更新多实例属性
 */
const loopPropertiesChange = () => {
  updateLoopProperties({
    loopCardinality: loopCardinality.value,
    loopCollection: loopCollection.value,
    loopVariable: loopVariable.value,
    loopCompletionCondition: loopCompletionCondition.value,
  })
}

watch(
  () => activeElementId.value,
  () => {
    initLoopProperties()
  },
  { immediate: true }
)
</script>
<template>
  <el-collapse-item name="bpmn-panel-loop">
    <template #title>
      <div class="flex-center">
        <bpmn-panel-title class-name="flex-1" name="多实例">
          <HelpFilled />
        </bpmn-panel-title>
        <el-tag v-show="loopType !== 'none'" size="small" type="danger" round effect="dark" class="mr-1">&nbsp;</el-tag>
      </div>
    </template>
    <el-form-item label="多实例类型" class="mb-2!">
      <el-radio-group v-model="loopType" @change="loopTypeChange">
        <el-radio-button label="无" value="none" />
        <el-radio-button label="并行" value="parallel" />
        <el-radio-button label="串行" value="sequential" />
      </el-radio-group>
    </el-form-item>
    <template v-if="loopType !== 'none'">
      <el-form-item label="基数" class="mb-2!">
        <el-input v-model="loopCardinality" :maxlength="200" show-word-limit placeholder="请输入基数" @change="loopPropertiesChange" />
      </el-form-item>
      <el-form-item label="集合" class="mb-2!">
        <el-input v-model="loopCollection" :maxlength="200" show-word-limit placeholder="请输入集合" @change="loopPropertiesChange" />
      </el-form-item>
      <el-form-item label="元素变量" class="mb-2!">
        <el-input v-model="loopVariable" :maxlength="200" show-word-limit placeholder="请输入元素变量" @change="loopPropertiesChange" />
      </el-form-item>
      <el-form-item label="完成条件" class="mb-2!">
        <el-input v-model="loopCompletionCondition" :maxlength="200" show-word-limit placeholder="请输入完成条件" @change="loopPropertiesChange" />
      </el-form-item>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
