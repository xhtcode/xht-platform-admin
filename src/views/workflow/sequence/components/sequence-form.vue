<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowSequenceById, saveFlowSequence, updateFlowSequence } from '@/service/api/workflow/sequence.api'
import type { FlowSequenceOperationRequest } from '@/service/model/workflow/sequence.model'
import { flowSequenceOperationForm, flowSequenceOperationRules } from '@/views/workflow/sequence/sequence.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowSequenceAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowSequenceOperationRequest>>({
  title: '增加流程扩展-流程序列号',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...flowSequenceOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<FlowSequenceOperationRequest>> = flowSequenceOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改流程扩展-流程序列号'
      const { data } = await queryFlowSequenceById(id)
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
          await saveFlowSequence(addUpdateForm.value)
          useMessage().success(`新增流程扩展-流程序列号成功`)
        } else {
          await updateFlowSequence(addUpdateForm.value)
          useMessage().success(`修改流程扩展-流程序列号成功`)
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
  addUpdateForm.value = { ...flowSequenceOperationForm }
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
          <el-form-item label="序列编码" prop="sequenceCode">
            <el-input v-model="addUpdateForm.sequenceCode" clearable :maxlength="60" show-word-limit placeholder="请输入序列编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序列名称" prop="sequenceName">
            <el-input v-model="addUpdateForm.sequenceName" clearable :maxlength="100" show-word-limit placeholder="请输入序列名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序列格式" prop="sequenceFormat">
            <el-date-picker
              v-model="addUpdateForm.sequenceFormat"
              format="YYYY-MM-DD"
              placeholder="选择序列格式"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小值" prop="minValue">
            <el-input v-model="addUpdateForm.minValue" clearable :maxlength="0" show-word-limit placeholder="请输入最小值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大值" prop="maxValue">
            <el-input v-model="addUpdateForm.maxValue" clearable :maxlength="0" show-word-limit placeholder="请输入最大值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前值" prop="currentValue">
            <el-input v-model="addUpdateForm.currentValue" clearable :maxlength="0" show-word-limit placeholder="请输入当前值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="步进值" prop="steppingValue">
            <el-input v-model="addUpdateForm.steppingValue" clearable :maxlength="0" show-word-limit placeholder="请输入步进值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否循环" prop="isCycle">
            <el-input v-model="addUpdateForm.isCycle" clearable :maxlength="1" show-word-limit placeholder="请输入是否循环" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重置周期" prop="resetFlag">
            <el-input v-model="addUpdateForm.resetFlag" clearable :maxlength="1" show-word-limit placeholder="请输入重置周期" />
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
