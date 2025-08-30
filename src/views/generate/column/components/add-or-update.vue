<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :title="state.title"
    append-to-body
    size="45%"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    />
    <el-form-item label="数据库字段名" prop="columnName">
      <el-input v-model="addUpdateForm.columnName" />
    </el-form-item>
    <el-form-item label="数据库字段类型,可用值:MySql,Oracle" prop="dbDataType">
      <el-input v-model="addUpdateForm.dbDataType" />
    </el-form-item>
    <el-form-item label="字段注释" prop="columnComment">
      <el-input v-model="addUpdateForm.columnComment" />
    </el-form-item>
    <el-form-item label="字段默认值" prop="defaultValue">
      <el-input v-model="addUpdateForm.defaultValue" />
    </el-form-item>
    <el-form-item label="是否必填" prop="isRequired">
      <el-input v-model="addUpdateForm.isRequired" />
    </el-form-item>
    <el-form-item label="是否主键" prop="isPrimary">
      <el-input v-model="addUpdateForm.isPrimary" />
    </el-form-item>

    <el-form-item label="表单项 0：否 1：是" prop="extConfig.formItem">
      <el-input v-model="addUpdateForm.extConfig.formItem" />
    </el-form-item>
    <el-form-item label="表单必填 0：否 1：是" prop="extConfig.formRequired">
      <el-input v-model="addUpdateForm.extConfig.formRequired" />
    </el-form-item>
    <el-form-item label="表单类型" prop="extConfig.formType">
      <el-input v-model="addUpdateForm.extConfig.formType" />
    </el-form-item>
    <el-form-item label="表单效验" prop="extConfig.formValidator">
      <el-input v-model="addUpdateForm.extConfig.formValidator" />
    </el-form-item>
    <el-form-item label="列表项 0：否 1：是" prop="extConfig.gridItem">
      <el-input v-model="addUpdateForm.extConfig.gridItem" />
    </el-form-item>
    <el-form-item label="列表排序 0：否 1：是" prop="extConfig.gridSort">
      <el-input v-model="addUpdateForm.extConfig.gridSort" />
    </el-form-item>
    <el-form-item label="查询项 0：否 1：是" prop="extConfig.queryItem">
      <el-input v-model="addUpdateForm.extConfig.queryItem" />
    </el-form-item>
    <el-form-item label="查询方式" prop="extConfig.queryType">
      <el-input v-model="addUpdateForm.extConfig.queryType" />
    </el-form-item>
    <el-form-item label="查询表单类型" prop="extConfig.queryFormType">
      <el-input v-model="addUpdateForm.extConfig.queryFormType" />
    </el-form-item>
    <el-form-item label="字段排序" prop="sortOrder">
      <el-input v-model="addUpdateForm.sortOrder" />
    </el-form-item>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import {
  queryGenColumnInfoById,
  saveGenColumnInfo,
  updateGenColumnInfo,
} from '@/api/generate/column.api'

import type { GenColumnInfoOperationRequest } from '@/model/generate/column.model'
import {
  GenColumnInfoOperationForm,
  GenColumnInfoOperationRules,
} from '@/views/generate/column/column.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'GenColumnInfoAddOrUpdate' })
const state = reactive<AddUpdateOption<GenColumnInfoOperationRequest>>({
  title: '增加字段信息',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...GenColumnInfoOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenColumnInfoOperationRules
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
    state.title = '修改字段信息'
    await queryGenColumnInfoById(id)
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
        await saveGenColumnInfo(addUpdateForm.value)
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
        await updateGenColumnInfo({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...GenColumnInfoOperationForm }
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
