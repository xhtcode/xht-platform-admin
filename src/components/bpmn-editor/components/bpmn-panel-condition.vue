<script setup lang="ts">
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { Share } from '@element-plus/icons-vue'
import { useConditionHooks } from '@/components/bpmn-editor/components/bpmn.condition.hooks'
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash'
defineOptions({
  name: 'BpmnPanelCondition',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { activeElementId } = storeToRefs(bpmnStore)
const { initFlowCondition, updateFlowType, updateFlowCondition } = useConditionHooks()
/**
 * 流转条件表单
 */
const flowConditionForm = ref<FlowConditionForm>({
  type: 'default',
})
/**
 * 初始化表单
 */
const initFormData = () => {
  const formData = initFlowCondition()
  flowConditionForm.value = { ...formData }
}

/**
 * 更新流转类型
 */
const handleUpdateFlowType = () => {
  if (flowConditionForm.value.type !== 'condition') {
    flowConditionForm.value = {
      type: flowConditionForm.value.type,
    }
  }
  updateFlowType(flowConditionForm.value.type)
  initFormData()
}

/**
 * 更新流转条件
 */
const handleUpdateFlowCondition = debounce(() => {
  updateFlowCondition({ ...flowConditionForm.value })
}, 100)

/**
 * 更新条件类型
 */
const handleUpdateConditionType = () => {
  flowConditionForm.value.body = ''
  flowConditionForm.value.resource = ''
  if (flowConditionForm.value.conditionType === 'script') {
    flowConditionForm.value.language = 'JavaScript'
    flowConditionForm.value.scriptType = 'externalScript'
  } else {
    flowConditionForm.value.language = undefined
    flowConditionForm.value.scriptType = undefined
  }
  handleUpdateFlowCondition()
}
onMounted(() => {
  initFormData()
})
watch(
  () => activeElementId.value,
  () => {
    initFormData()
  }
)
</script>

<template>
  <el-collapse-item name="bpmn-panel-condition">
    <template #title>
      <bpmn-panel-title name="流转条件">
        <Share />
      </bpmn-panel-title>
    </template>
    <el-form-item label="条件类型" class="mb-2!">
      <el-radio-group v-model="flowConditionForm.type" @change="handleUpdateFlowType()">
        <el-radio-button label="普通" value="normal" />
        <el-radio-button label="默认" value="default" />
        <el-radio-button label="条件" value="condition" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="条件格式" v-if="flowConditionForm.type === 'condition'" class="mb-2!">
      <el-select v-model="flowConditionForm.conditionType" @change="handleUpdateConditionType()" placeholder="请选择条件格式">
        <el-option label="表达式" value="expression" />
        <el-option label="脚本" value="script" />
      </el-select>
    </el-form-item>
    <el-form-item label="表达式" class="mb-0!" v-if="flowConditionForm.conditionType === 'expression'">
      <el-input
        v-model="flowConditionForm.body"
        @input="handleUpdateFlowCondition()"
        type="textarea"
        :rows="3"
        resize="none"
        clearable
        :maxlength="200"
        show-word-limit
        placeholder="请输入表达式"
      />
    </el-form-item>

    <template v-if="flowConditionForm.conditionType === 'script'">
      <el-form-item label="脚本语言" key="language">
        <el-select v-model="flowConditionForm.language" @change="handleUpdateFlowCondition()" placeholder="请选择脚本语言">
          <el-option label="JavaScript" value="JavaScript" />
          <el-option label="Python" value="Python" />
        </el-select>
      </el-form-item>
      <el-form-item label="脚本类型" key="scriptType">
        <el-select v-model="flowConditionForm.scriptType" @change="handleUpdateFlowCondition()" placeholder="请选择脚本类型">
          <el-option label="内联脚本" value="inlineScript" />
          <el-option label="外部脚本" value="externalScript" />
        </el-select>
      </el-form-item>
      <el-form-item label="脚本" v-if="flowConditionForm.scriptType === 'inlineScript'">
        <el-input
          v-model="flowConditionForm.body"
          @input="handleUpdateFlowCondition()"
          type="textarea"
          :rows="3"
          resize="none"
          clearable
          :maxlength="200"
          show-word-limit
          placeholder="请输入脚本"
        />
      </el-form-item>
      <el-form-item label="资源地址" v-if="flowConditionForm.scriptType === 'externalScript'">
        <el-input
          v-model="flowConditionForm.resource"
          @input="handleUpdateFlowCondition()"
          type="textarea"
          :rows="3"
          resize="none"
          clearable
          :maxlength="200"
          show-word-limit
          placeholder="请输入资源地址"
        />
      </el-form-item>
    </template>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
