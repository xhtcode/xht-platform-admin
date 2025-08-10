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
  queryGenDataSourceById,
  saveGenDataSource,
  updateGenDataSource,
} from '@/api/generate/datasource.api'
import { AddUpdateOption } from '@/hooks/use-crud-hooks'
import type { GenDataSourceOperationRequest } from '@/model/generate/datasource.model'
import {
  GenDataSourceOperationForm,
  GenDataSourceOperationRules,
} from '@/views/generate/datasource/datasource.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { errorFormParams } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'GenDataSourceAddOrUpdate' })
const state = reactive<AddUpdateOption<GenDataSourceOperationRequest>>({
  title: '增加数据源配置',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...GenDataSourceOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenDataSourceOperationRules
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
    state.title = '修改数据源配置'
    await queryGenDataSourceById(id)
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
        await saveGenDataSource(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            errorFormParams(err, addUpdateFormRef, addUpdateForm)
          })
          .finally(() => {
            state.loadingStatus = false
          })
      } else {
        //修改
        await updateGenDataSource({ ...addUpdateForm.value })
          .then((_) => {
            useMessage().success('修改数据成功')
            emits('success')
            close()
          })
          .catch((err: any) => {
            errorFormParams(err, addUpdateFormRef, addUpdateForm)
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
  addUpdateForm.value = { ...GenDataSourceOperationForm }
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
