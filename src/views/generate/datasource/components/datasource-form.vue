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
      label-width="80px"
      scroll-to-error
      inline-message
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="addUpdateForm.name"
          placeholder="请输入数据源名称"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="类型" prop="dbType">
        <el-select v-model="addUpdateForm.dbType" placeholder="请选择数据库类型">
          <el-option :value="DataBaseTypeEnums.MYSQL" label="MySql" />
          <el-option :value="DataBaseTypeEnums.ORACLE" label="Oracle" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="url">
        <el-input
          v-model="addUpdateForm.url"
          placeholder="请输入数据库连接URL"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="addUpdateForm.username"
          placeholder="请输入数据库链接用户名"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="addUpdateForm.password"
          placeholder="请输入数据库链接密码"
          maxlength="100"
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
} from '@/service/api/generate/datasource.api'

import type { GenDataSourceOperationRequest } from '@/service/model/generate/datasource.model'
import {
  GenDataSourceOperationForm,
  GenDataSourceOperationRules,
} from '@/views/generate/datasource/datasource.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/service/model/base.model'
import { DataBaseTypeEnums } from '@/service/enums/generate/generate.enums'

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
            handleFormErrors(err, addUpdateFormRef, addUpdateForm)
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
  if (state.loadingStatus) return
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
