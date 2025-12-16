<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysDictById, saveSysDict, updateSysDict } from '@/service/api/demo/dict.api'
import type { SysDictOperationRequest } from '@/service/model/demo/dict.model'
import { SysDictOperationForm, SysDictOperationRules } from '@/views/demo/dict/dict.data'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({ name: 'SysDictAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysDictOperationRequest>>({
  title: '增加系统管理-字典表',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...SysDictOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const rules: FormRules = SysDictOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改系统管理-字典表'
      const { data } = await querySysDictById(id)
      addUpdateForm.value = data
    }
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
          await saveSysDict(addUpdateForm.value)
          useMessage().success(`新增系统管理-字典表成功`)
        } else {
          await updateSysDict(addUpdateForm.value)
          useMessage().success(`修改系统管理-字典表成功`)
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
  <el-0
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
      <el-row>
        <el-col :span="4">
          <el-form-item label="字典编码" prop="dictCode">
            <el-input v-model="addUpdateForm.dictCode" :maxlength="64" placeholder="请输入字典编码" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="addUpdateForm.dictName" :maxlength="128" placeholder="请输入字典名称" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input v-model="addUpdateForm.sortOrder" :maxlength="0" placeholder="请输入排序序号" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="字典描述" prop="remark">
            <el-input v-model="addUpdateForm.remark" :maxlength="512" placeholder="请输入字典描述" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-input v-model="addUpdateForm.status" :maxlength="0" placeholder="请输入状态" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-0>
</template>

<style lang="scss" scoped></style>
