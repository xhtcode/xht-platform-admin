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
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="addUpdateForm.groupName" :maxlength="50" placeholder="请输入分组名称" show-word-limit />
      </el-form-item>
      <el-form-item label="模板数量" prop="templateCount">
        <el-input-number v-model="addUpdateForm.templateCount" :max="999" :min="1" class="!w-full" disabled placeholder="模板数量后台生成" />
      </el-form-item>
      <el-form-item label="分组排序" prop="groupSort">
        <el-input-number v-model="addUpdateForm.groupSort" :max="999" :min="1" class="!w-full" placeholder="请输入分组排序" />
      </el-form-item>
      <el-form-item label="分组描述" prop="groupDesc">
        <el-input
          v-model="addUpdateForm.groupDesc"
          :maxlength="200"
          :rows="5"
          placeholder="请输入分组描述"
          resize="none"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryGenTemplateGroupById, saveGenTemplateGroup, updateGenTemplateGroup } from '@/service/api/generate/template.group.api'
import { GenTemplateGroupOperationForm, GenTemplateGroupOperationRules } from '@/views/generate/template/template.data'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'
import type { GenTemplateGroupOperationRequest } from '@/service/model/generate/template.group.model'

defineOptions({ name: 'TemplateGroupForm' })

const state = reactive<AddUpdateOption<GenTemplateGroupOperationRequest>>({
  title: '增加模板分组',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...GenTemplateGroupOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenTemplateGroupOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改模板分组'
      const { data } = await queryGenTemplateGroupById(id)
      addUpdateForm.value = data
    }
  } finally {
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
          await saveGenTemplateGroup(addUpdateForm.value)
          useMessage().success('新增模板分组成功')
        } else {
          await updateGenTemplateGroup(addUpdateForm.value)
          useMessage().success('修改模板分组成功')
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
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<style scoped></style>
