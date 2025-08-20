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
      <el-form-item label="表ID" prop="id">
        <el-input v-model="addUpdateForm.id" placeholder="请输入表ID" />
      </el-form-item>
      <el-form-item label="分组id" prop="groupId">
        <el-input v-model="addUpdateForm.groupId" placeholder="请输入分组id" />
      </el-form-item>
      <el-form-item label="数据源ID" prop="dataSourceId">
        <el-input v-model="addUpdateForm.dataSourceId" placeholder="请输入数据源ID" />
      </el-form-item>
      <el-form-item label="引擎名称" prop="engineName">
        <el-input v-model="addUpdateForm.engineName" placeholder="请输入引擎名称" />
      </el-form-item>
      <el-form-item label="数据库表名" prop="tableName">
        <el-input v-model="addUpdateForm.tableName" placeholder="请输入数据库表名" />
      </el-form-item>
      <el-form-item label="表注释" prop="tableComment">
        <el-input v-model="addUpdateForm.tableComment" placeholder="请输入表注释" />
      </el-form-item>
      <el-form-item label="生成的类名" prop="codeName">
        <el-input v-model="addUpdateForm.codeName" placeholder="请输入生成的类名" />
      </el-form-item>
      <el-form-item label="代码的注释" prop="codeComment">
        <el-input v-model="addUpdateForm.codeComment" placeholder="请输入代码的注释" />
      </el-form-item>
      <el-form-item label="创建时间" prop="tableCreateTime">
        <el-input v-model="addUpdateForm.tableCreateTime" placeholder="请输入创建时间" />
      </el-form-item>
      <el-form-item label="更新时间" prop="tableUpdateTime">
        <el-input v-model="addUpdateForm.tableUpdateTime" placeholder="请输入更新时间" />
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
  queryGenTableInfoById,
  saveGenTableInfo,
  updateGenTableInfo,
} from '@/api/generate/table.api'

import type { GenTableInfoOperationRequest } from '@/model/generate/table.model'
import {
  GenTableInfoOperationForm,
  GenTableInfoOperationRules,
} from '@/views/generate/table/table.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { handleFormErrors } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'GenTableInfoAddOrUpdate' })
const state = reactive<AddUpdateOption<GenTableInfoOperationRequest>>({
  title: '增加表信息',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...GenTableInfoOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenTableInfoOperationRules
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
    state.title = '修改表信息'
    await queryGenTableInfoById(id)
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
        await saveGenTableInfo(addUpdateForm.value)
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
        await updateGenTableInfo({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...GenTableInfoOperationForm }
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
