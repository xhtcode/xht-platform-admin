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
      label-width="120px"
    >
      <el-form-item label="数据库数据类型" prop="dbDataType">
        <el-input v-model="addUpdateForm.dbDataType" />
      </el-form-item>
      <el-form-item label="数据库类型" prop="dbType">
        <el-select v-model="addUpdateForm.dbType" placeholder="请选择数据库类型">
          <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
          <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
        </el-select>
      </el-form-item>
      <el-form-item label="编程语言" prop="targetLanguage">
        <el-select v-model="addUpdateForm.targetLanguage" placeholder="请选择目标编程语言">
          <el-option :value="LanguageTypeEnums.JAVA" label="Java" />
          <el-option :value="LanguageTypeEnums.TYPESCRIPT" label="TypeScript" />
        </el-select>
      </el-form-item>
      <el-form-item label="编程语言类型" prop="targetDataType">
        <el-input v-model="addUpdateForm.targetDataType" />
      </el-form-item>
      <el-form-item label="导入包路径" prop="importPackage">
        <el-input v-model="addUpdateForm.importPackage" />
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
  queryGenTypeMappingById,
  saveGenTypeMapping,
  updateGenTypeMapping,
} from '@/api/generate/type.mapping.api'

import type { GenTypeMappingOperationRequest } from '@/model/generate/type.mapping.model'
import {
  GenTypeMappingOperationForm,
  GenTypeMappingOperationRules,
} from '@/views/generate/type-mapping/type.mapping.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/common/enums/generate/generate.enums'

defineOptions({ name: 'GenTypeMappingAddOrUpdate' })
const state = reactive<AddUpdateOption<GenTypeMappingOperationRequest>>({
  title: '增加字段类型映射',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...GenTypeMappingOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenTypeMappingOperationRules
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
    state.title = '修改字段类型映射'
    await queryGenTypeMappingById(id)
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
        await saveGenTypeMapping(addUpdateForm.value)
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
        await updateGenTypeMapping({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...GenTypeMappingOperationForm }
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
