<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :title="state.title"
    size="45vw"
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      label-width="100px"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典编码" prop="dictCode">
            <el-input
              v-model="addUpdateForm.dictCode"
              :maxlength="50"
              show-word-limit
              placeholder="请输入字典编码"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              v-model="addUpdateForm.dictName"
              :maxlength="50"
              show-word-limit
              placeholder="请输入字典名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input-number
              v-model="addUpdateForm.sortOrder"
              class="w100"
              :min="0"
              :max="999"
              placeholder="请输入排序序号"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <el-form-item label="字典状态" prop="status">
            <el-select v-model="addUpdateForm.status" placeholder="请选择字典状态">
              <el-option label="启用" :value="DictStatusEnums.ENABLED" />
              <el-option label="禁用" :value="DictStatusEnums.DISABLED" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典描述" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              resize="none"
              :rows="5"
              :maxlength="200"
              show-word-limit
              placeholder="请输入字典描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysDictById, saveSysDict, updateSysDict } from '@/api/system/dict.api'
import { AddUpdateOption } from '@/hooks/use-crud-hooks'
import type { SysDictOperationRequest } from '@/model/system/dict.model'
import { DictStatusEnums } from '@/model/system/dict.model'
import { SysDictOperationForm, SysDictOperationRules } from '@/views/system/dict/dict.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { errorFormParams } from '@/utils/moudle/element'
import type { ModeIdType } from '@/model/base.model'

defineOptions({ name: 'SysDictAddOrUpdate' })
const state = reactive<AddUpdateOption<SysDictOperationRequest>>({
  title: '增加字典',
  visibleStatus: false,
  operationStatus: 'add',
  loadingStatus: false,
  addUpdateForm: { ...SysDictOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = SysDictOperationRules
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
    state.title = '修改字典'
    await querySysDictById(id)
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
        await saveSysDict(addUpdateForm.value)
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
        await updateSysDict({ ...addUpdateForm.value })
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
  addUpdateForm.value = { ...SysDictOperationForm }
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
