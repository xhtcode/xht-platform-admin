<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { queryGenDataSourceById, saveGenDataSource, updateGenDataSource } from '@/service/api/generate/datasource.api'
import { genDataSourceOperationForm, genDataSourceOperationRules } from '@/views/generate/datasource/datasource.data'
import { useMessage } from '@/hooks/use-message'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'
import type { GenDataSourceOperationRequest } from '@/service/model/generate/datasource.model'

defineOptions({ name: 'GenDataSourceAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<GenDataSourceOperationRequest>>({
  title: '增加数据源配置',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...genDataSourceOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<GenDataSourceOperationRequest>> = genDataSourceOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改数据源配置'
      const { data } = await queryGenDataSourceById(id)
      addUpdateForm.value = { ...data }
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
          await saveGenDataSource(addUpdateForm.value)
          useMessage().success('新增数据成功')
        } else {
          await updateGenDataSource({ ...addUpdateForm.value })
          useMessage().success('修改数据成功')
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="addUpdateForm.name" maxlength="100" placeholder="请输入数据源名称" show-word-limit />
      </el-form-item>
      <el-form-item label="类型" prop="dbType">
        <el-select v-model="addUpdateForm.dbType" placeholder="请选择数据库类型" clearable>
          <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
          <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUpdateForm.username" maxlength="100" placeholder="请输入数据库链接用户名" show-word-limit />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUpdateForm.password" type="password" show-password maxlength="100" placeholder="请输入数据库链接密码" show-word-limit />
      </el-form-item>
      <el-form-item label="地址" prop="url">
        <el-input
          v-model="addUpdateForm.url"
          type="textarea"
          :rows="5"
          :spellcheck="false"
          resize="none"
          :maxlength="200"
          placeholder="请输入数据库连接URL"
          show-word-limit
        />
      </el-form-item>
      <template v-if="state.operationStatus === 'update'">
        <el-form-item label="测试结果" prop="testResult">
          <el-input v-model="addUpdateForm.testResult" disabled placeholder="测试结果" />
        </el-form-item>
        <el-form-item label="测试时间" prop="lastTestTime">
          <el-input v-model="addUpdateForm.lastTestTime" disabled placeholder="测试时间" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style scoped></style>
