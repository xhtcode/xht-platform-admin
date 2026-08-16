<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowDefinitionById, saveFlowDefinition, updateFlowDefinition } from '@/service/api/workflow/definition.api'
import type { FlowDefinitionOperationRequest } from '@/service/model/workflow/definition.model'
import { flowDefinitionOperationForm, flowDefinitionOperationRules } from '@/views/workflow/definition/definition.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowDefinitionAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowDefinitionOperationRequest>>({
  title: '增加流程定义',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...flowDefinitionOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<FlowDefinitionOperationRequest>> = flowDefinitionOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改流程定义'
      const { data } = await queryFlowDefinitionById(id)
      addUpdateForm.value = data
    }
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
  }
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (state.operationStatus === 'create') {
          await saveFlowDefinition(addUpdateForm.value)
          useMessage().success(`新增流程定义成功`)
        } else {
          await updateFlowDefinition(addUpdateForm.value)
          useMessage().success(`修改流程定义成功`)
        }
        emits('success')
        state.loadingStatus = false
        close()
      } catch {
        state.loadingStatus = false
      }
    } else {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...flowDefinitionOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    :title="state.title"
    size="45%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="120px"
      scroll-to-error
    ></el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
