<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowDefinitionById, saveFlowDefinition, updateFlowDefinition } from '@/service/api/workflow/definition.api'
import type { FlowDefinitionOperationRequest } from '@/service/model/workflow/definition.model'
import { flowDefinitionOperationForm, flowDefinitionOperationRules } from '@/views/workflow/definition/definition.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowDefinitionAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowDefinitionOperationRequest>>({
  title: '增加流程扩展-流程定义',
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
      state.title = '修改流程扩展-流程定义'
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
          useMessage().success(`新增流程扩展-流程定义成功`)
        } else {
          await updateFlowDefinition(addUpdateForm.value)
          useMessage().success(`修改流程扩展-流程定义成功`)
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
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="类别id" prop="categoryId">
            <el-input v-model="addUpdateForm.categoryId" clearable :maxlength="0" show-word-limit placeholder="请输入类别id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模型id" prop="modelId">
            <el-input v-model="addUpdateForm.modelId" clearable :maxlength="64" show-word-limit placeholder="请输入模型id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模型名称" prop="modelName">
            <el-input v-model="addUpdateForm.modelName" clearable :maxlength="255" show-word-limit placeholder="请输入模型名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模型版本" prop="modelVersion">
            <el-input v-model="addUpdateForm.modelVersion" clearable :maxlength="0" show-word-limit placeholder="请输入模型版本" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程定义状态" prop="definitionStatus">
            <el-input v-model="addUpdateForm.definitionStatus" clearable :maxlength="0" show-word-limit placeholder="请输入流程定义状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程定义排序" prop="definitionSort">
            <el-input-number
              v-model="addUpdateForm.definitionSort"
              :min="0"
              :max="999"
              class="w-full!"
              value-on-clear="min"
              placeholder="请输入流程定义排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程定义标识" prop="definitionKey">
            <el-input v-model="addUpdateForm.definitionKey" clearable :maxlength="255" show-word-limit placeholder="请输入流程定义标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程定义名称" prop="definitionName">
            <el-input v-model="addUpdateForm.definitionName" clearable :maxlength="255" show-word-limit placeholder="请输入流程定义名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程定义描述" prop="definitionDesc">
            <el-input
              v-model="addUpdateForm.definitionDesc"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              :maxlength="255"
              show-word-limit
              placeholder="请输入流程定义描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程部署id" prop="deploymentId">
            <el-input v-model="addUpdateForm.deploymentId" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程部署状态" prop="deploymentStatus">
            <el-input v-model="addUpdateForm.deploymentStatus" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程部署版本" prop="deploymentVersion">
            <el-input v-model="addUpdateForm.deploymentVersion" clearable :maxlength="255" show-word-limit placeholder="请输入流程部署版本" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程部署时间" prop="deploymentTime">
            <el-date-picker
              v-model="addUpdateForm.deploymentTime"
              format="YYYY-MM-DD"
              placeholder="选择流程部署时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单id" prop="formId">
            <el-input v-model="addUpdateForm.formId" clearable :maxlength="255" show-word-limit placeholder="请输入表单id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单名称" prop="formName">
            <el-input v-model="addUpdateForm.formName" clearable :maxlength="255" show-word-limit placeholder="请输入表单名称" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
