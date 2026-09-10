<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowModelById, saveFlowModel, updateFlowModel } from '@/service/api/workflow/model.api'
import type { FlowModelOperationRequest } from '@/service/model/workflow/model.model'
import { flowModelOperationForm, flowModelOperationRules } from '@/views/workflow/model/model.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowModelAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowModelOperationRequest>>({
  title: '增加流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...flowModelOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<FlowModelOperationRequest>> = flowModelOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储'
      const { data } = await queryFlowModelById(id)
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
      if (state.operationStatus === 'create') {
        saveFlowModel(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`新增流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储成功`)
            state.loadingStatus = false
            close()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        updateFlowModel(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`修改流程模板信息表，存储流程模板相关描述信息，流程定义的bpmn文件放在act_ge_bytearray表中，以字节形式存储成功`)
            state.loadingStatus = false
            close()
          })
          .finally(() => {
            state.loadingStatus = false
          })
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
  addUpdateForm.value = { ...flowModelOperationForm }
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
          <el-form-item label="" prop="rev">
            <el-input v-model="addUpdateForm.rev" clearable :maxlength="0" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="name">
            <el-input v-model="addUpdateForm.name" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="key">
            <el-input v-model="addUpdateForm.key" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="category">
            <el-input v-model="addUpdateForm.category" clearable :maxlength="255" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="lastUpdateTime">
            <el-input v-model="addUpdateForm.lastUpdateTime" clearable :maxlength="0" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="version">
            <el-input v-model="addUpdateForm.version" clearable :maxlength="0" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="metaInfo">
            <el-input v-model="addUpdateForm.metaInfo" clearable :maxlength="4000" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="deploymentId">
            <el-input v-model="addUpdateForm.deploymentId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="editorSourceValueId">
            <el-input v-model="addUpdateForm.editorSourceValueId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="editorSourceExtraValueId">
            <el-input v-model="addUpdateForm.editorSourceExtraValueId" clearable :maxlength="64" show-word-limit placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="tenantId">
            <el-input v-model="addUpdateForm.tenantId" clearable :maxlength="255" show-word-limit placeholder="请输入" />
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
