<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowSequenceById, saveFlowSequence, updateFlowSequence } from '@/service/api/workflow/sequence.api'
import type { FlowSequenceOperationRequest } from '@/service/model/workflow/sequence.model'
import { flowSequenceOperationForm, flowSequenceOperationRules } from '@/views/workflow/sequence/sequence.data'
import { useMessage } from '@/hooks/use-message'
import { IsCycleStatusEnum, IsResetFlagEnum } from '@/service/enums/workflow/sequence.enum'
import { Bell } from '@element-plus/icons-vue'

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
      if (state.operationStatus === 'create') {
        saveFlowSequence(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`新增流程扩展-流程序列号成功`)
            state.loadingStatus = false
            close()
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        updateFlowSequence(addUpdateForm.value)
          .then(() => {
            emits('success')
            useMessage().success(`修改流程扩展-流程序列号成功`)
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
  addUpdateForm.value = { ...flowSequenceOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

const handleChangeMinValue = () => {
  addUpdateForm.value.currentValue = Math.max(addUpdateForm.value.minValue ?? 0, addUpdateForm.value.currentValue ?? 0)
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
      label-width="100px"
      scroll-to-error
    >
      <el-form-item label="序列名称" prop="sequenceName">
        <el-input v-model="addUpdateForm.sequenceName" clearable :maxlength="100" show-word-limit placeholder="请输入序列名称" />
      </el-form-item>
      <el-form-item label="序列编码" prop="sequenceCode">
        <el-input v-model="addUpdateForm.sequenceCode" clearable :maxlength="60" show-word-limit placeholder="请输入序列编码" />
      </el-form-item>
      <el-form-item label="最小值" prop="minValue">
        <el-input-number
          v-model="addUpdateForm.minValue"
          :min="1"
          :max="addUpdateForm.maxValue"
          class="w-full!"
          value-on-clear="min"
          @change="handleChangeMinValue"
          placeholder="请输入最小值"
        />
      </el-form-item>
      <el-form-item label="最大值" prop="maxValue">
        <el-input-number
          v-model="addUpdateForm.maxValue"
          :min="addUpdateForm.minValue"
          :max="999999"
          class="w-full!"
          value-on-clear="max"
          placeholder="请输入最大值"
        />
      </el-form-item>
      <el-form-item label="当前值" prop="currentValue">
        <el-input-number
          v-model="addUpdateForm.currentValue"
          :min="addUpdateForm.minValue"
          :max="addUpdateForm.maxValue"
          class="w-full!"
          value-on-clear="min"
          placeholder="请输入当前值"
        />
      </el-form-item>
      <el-form-item label="步进值" prop="steppingValue">
        <el-input-number v-model="addUpdateForm.steppingValue" :min="0" :max="100" class="w-full!" value-on-clear="min" placeholder="请输入步进值" />
      </el-form-item>
      <el-form-item label="是否循环" prop="isCycle">
        <xht-enum-select v-model="addUpdateForm.isCycle" :data="IsCycleStatusEnum" clearable placeholder="请选择是否循环" />
      </el-form-item>
      <el-form-item label="重置周期" prop="resetFlag">
        <xht-enum-select v-model="addUpdateForm.resetFlag" :data="IsResetFlagEnum" clearable placeholder="请选择重置周期" />
      </el-form-item>
      <el-form-item label="序列格式" prop="sequenceFormat">
        <el-input
          v-model="addUpdateForm.sequenceFormat"
          type="textarea"
          :rows="5"
          resize="none"
          clearable
          :maxlength="500"
          show-word-limit
          placeholder="请输入序列格式"
        />
      </el-form-item>
    </el-form>
    <el-alert :closable="false" show-icon type="primary">
      <template #title><el-text type="danger" tag="b" class="user-select-none">示例：032000{YYYYMMDD}-{N}</el-text></template>
      <ul class="pl-5 color-[var(--xht-text-color)] user-select-none">
        <li>YYYYMMDD,当前日期的格式定义，支持YYYY,YY,MM,DD几种格式组合</li>
        <li>{N}原值显示当前值 {N6}当前值显示的最小长度为6位，不足时前面补零</li>
      </ul>
      <template #icon>
        <Bell />
      </template>
    </el-alert>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
