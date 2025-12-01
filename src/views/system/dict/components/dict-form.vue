<template>
  <el-drawer v-model="state.visibleStatus" :before-close="close" :title="state.title" append-to-body size="45%">
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
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="字典编码" prop="dictCode">
            <el-input v-model="addUpdateForm.dictCode" :maxlength="50" placeholder="请输入字典编码" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="addUpdateForm.dictName" :maxlength="50" placeholder="请输入字典名称" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="排序序号" prop="sortOrder">
            <el-input-number v-model="addUpdateForm.sortOrder" :max="999" :min="0" class="w100" placeholder="请输入排序序号" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="字典状态" prop="status">
            <el-select v-model="addUpdateForm.status" placeholder="请选择字典状态">
              <el-option :value="DictStatusEnums.ENABLED" label="启用" />
              <el-option :value="DictStatusEnums.DISABLED" label="禁用" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典描述" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              :maxlength="200"
              :rows="5"
              placeholder="请输入字典描述"
              resize="none"
              show-word-limit
              type="textarea"
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
import { querySysDictById, saveSysDict, updateSysDict } from '@/service/api/system/dict.api'
import { SysDictOperationForm, SysDictOperationRules } from '@/views/system/dict/dict.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { SysDictOperationRequest } from '@/service/model/system/dict.model'
import type { ModeIdType } from '@/service/model/base.model'
import { DictStatusEnums } from '@/service/model/system/dict.model'

defineOptions({ name: 'SysDictAddOrUpdate' })

const state = reactive<AddUpdateOption<SysDictOperationRequest>>({
  title: '增加字典',
  visibleStatus: false,
  operationStatus: 'create',
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
const show = async (type: 'create' | 'update', id: ModeIdType) => {
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
      if (state.operationStatus === 'create') {
        //增加
        await saveSysDict(addUpdateForm.value)
          .then((_) => {
            useMessage().success('新增数据成功')
            emits('success')
            close()
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
  addUpdateForm.value = { ...SysDictOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}
defineExpose({
  show,
})
</script>

<style scoped></style>
