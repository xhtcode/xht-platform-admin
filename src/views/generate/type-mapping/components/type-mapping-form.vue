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
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryGenTypeMappingById, saveGenTypeMapping, updateGenTypeMapping } from '@/service/api/generate/type.mapping.api'
import { GenTypeMappingOperationForm, GenTypeMappingOperationRules } from '@/views/generate/type-mapping/type.mapping.data'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'
import type { GenTypeMappingOperationRequest } from '@/service/model/generate/type.mapping.model'
import { DataBaseTypeEnums, LanguageTypeEnums } from '@/service/enums/generate/generate.enums'

defineOptions({ name: 'GenTypeMappingAddOrUpdate' })
const state = reactive<AddUpdateOption<GenTypeMappingOperationRequest>>({
  title: '增加字段类型映射',
  visibleStatus: false,
  operationStatus: 'create',
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
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改字段类型映射'
      const { data } = await queryGenTypeMappingById(id)
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
  state.visibleStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (state.operationStatus === 'create') {
          await saveGenTypeMapping(addUpdateForm.value)
          useMessage().success('新增类型映射成功')
        } else {
          await updateGenTypeMapping({ ...addUpdateForm.value })
          useMessage().success('修改类型映射成功')
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
