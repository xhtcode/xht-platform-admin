<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryFlowCategoryById, saveFlowCategory, updateFlowCategory } from '@/service/api/workflow/category.api'
import type { FlowCategoryOperationRequest } from '@/service/model/workflow/category.model'
import { flowCategoryOperationForm, flowCategoryOperationRules } from '@/views/workflow/category/category.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'FlowCategoryAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<FlowCategoryOperationRequest>>({
  title: '增加流程扩展-流程分类',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...flowCategoryOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<FlowCategoryOperationRequest>> = flowCategoryOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改流程扩展-流程分类'
      const { data } = await queryFlowCategoryById(id)
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
          await saveFlowCategory(addUpdateForm.value)
          useMessage().success(`新增流程扩展-流程分类成功`)
        } else {
          await updateFlowCategory(addUpdateForm.value)
          useMessage().success(`修改流程扩展-流程分类成功`)
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
  addUpdateForm.value = { ...flowCategoryOperationForm }
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
          <el-form-item label="类别编码" prop="categoryCode">
            <el-input v-model="addUpdateForm.categoryCode" clearable :maxlength="255" show-word-limit placeholder="请输入类别编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别名称" prop="categoryName">
            <el-input v-model="addUpdateForm.categoryName" clearable :maxlength="255" show-word-limit placeholder="请输入类别名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别描述" prop="categoryDesc">
            <el-input
              v-model="addUpdateForm.categoryDesc"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              :maxlength="255"
              show-word-limit
              placeholder="请输入类别描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别状态" prop="categoryStatus">
            <el-input v-model="addUpdateForm.categoryStatus" clearable :maxlength="0" show-word-limit placeholder="请输入类别状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别排序" prop="categorySort">
            <el-input-number
              v-model="addUpdateForm.categorySort"
              :min="0"
              :max="999"
              class="w-full!"
              value-on-clear="min"
              placeholder="请输入类别排序"
            />
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
