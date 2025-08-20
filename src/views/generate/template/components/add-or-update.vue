<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :title="state.title"
    append-to-body
    size="45vw"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-form-item label="模板ID" prop="id">
        <el-input v-model="addUpdateForm.id" placeholder="请输入模板ID" />
      </el-form-item>
      <el-form-item label="分组id" prop="groupId">
        <el-input v-model="addUpdateForm.groupId" placeholder="请输入分组id" />
      </el-form-item>
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="addUpdateForm.name" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="模板内容（Velocity语法）" prop="content">
        <el-input v-model="addUpdateForm.content" placeholder="请输入模板内容（Velocity语法）" />
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-input v-model="addUpdateForm.fileType" placeholder="请输入文件类型" />
      </el-form-item>
      <el-form-item label="文件路径模板" prop="filePathTemplate">
        <el-input v-model="addUpdateForm.filePathTemplate" placeholder="请输入文件路径模板" />
      </el-form-item>
      <el-form-item label="文件名模板" prop="fileNameTemplate">
        <el-input v-model="addUpdateForm.fileNameTemplate" placeholder="请输入文件名模板" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import {
  queryGenTemplateById,
  saveGenTemplate,
  updateGenTemplate,
} from '@/api/generate/template.api'

import type { GenTemplateOperationRequest } from '@/model/generate/template.model'
import {
  GenTemplateOperationForm,
  GenTemplateOperationRules,
} from '@/views/generate/template/template.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'GenTemplateAddOrUpdate' })
const state = reactive<AddUpdateOption<GenTemplateOperationRequest>>({
  title: '增加模板信息',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...GenTemplateOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenTemplateOperationRules
/**
 * 打开显示
 */
const show = async (type: 'add' | 'update', id: ModeIdType) => {
  state.visibleStatus = true
  await nextTick(() => {
    addUpdateFormRef.value?.resetFields()
  })
  state.operationStatus = type
  if (type === 'update') {
    state.loadingStatus = true
    state.title = '修改模板信息'
    await queryGenTemplateById(id)
      .then((response) => {
        const { data } = JSON.parse(JSON.stringify(response))
        addUpdateForm.value = { ...data }
      })
      .catch(() => {
        useMessage().error('数据初始化加载失败')
      })
      .finally(() => {
        state.loadingStatus = false
      })
  }
}
/**
 * 提交表单
 */
const submitForm = () => {
  state.visibleStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (state.operationStatus === 'add') {
        //增加
        await saveGenTemplate(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            handleFormErrors(err, addUpdateFormRef, addUpdateForm)
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        //修改
        await updateGenTemplate({ ...addUpdateForm.value })
          .then((_) => {
            useMessage().success('修改数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            handleFormErrors(err, addUpdateFormRef, addUpdateForm)
          })
          .finally(() => {
            state.loadingStatus = false
          })
      }
    } else {
      state.loadingStatus = false
      useMessageBox().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  addUpdateForm.value = { ...GenTemplateOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'add'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>

<style scoped></style>
