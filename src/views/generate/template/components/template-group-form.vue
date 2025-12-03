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
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="addUpdateForm.groupName" :maxlength="50" placeholder="请输入分组名称" show-word-limit />
      </el-form-item>
      <el-form-item label="模板数量" prop="templateCount">
        <el-input-number v-model="addUpdateForm.templateCount" :max="999" :min="1" class="!w-full" disabled placeholder="模板数量后台生成" />
      </el-form-item>
      <el-form-item label="分组排序" prop="groupSort">
        <el-input-number v-model="addUpdateForm.groupSort" :max="999" :min="1" class="!w-full" placeholder="请输入分组排序" />
      </el-form-item>
      <el-form-item label="分组描述" prop="groupDesc">
        <el-input
          v-model="addUpdateForm.groupDesc"
          :maxlength="200"
          :rows="5"
          placeholder="请输入分组描述"
          resize="none"
          show-word-limit
          type="textarea"
        />
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
import { queryGenTemplateGroupById, saveGenTemplateGroup, updateGenTemplateGroup } from '@/service/api/generate/template.group.api'
import { GenTemplateGroupOperationForm, GenTemplateGroupOperationRules } from '@/views/generate/template/template.data'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'
import type { GenTemplateGroupOperationRequest } from '@/service/model/generate/template.group.model'

defineOptions({ name: 'TemplateGroupForm' })

const state = reactive<AddUpdateOption<GenTemplateGroupOperationRequest>>({
  title: '增加模板分组',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...GenTemplateGroupOperationForm },
})
const addUpdateFormRef = ref<FormInstance>()
const { addUpdateForm } = toRefs(state)
const emits = defineEmits(['success'])
const rules: FormRules = GenTemplateGroupOperationRules
/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  state.visibleStatus = true
  state.operationStatus = type
  if (type === 'update') {
    state.loadingStatus = true
    state.title = '修改模板分组'
    await queryGenTemplateGroupById(id)
      .then((response) => {
        const { data } = JSON.parse(JSON.stringify(response))
        if (data) {
          addUpdateForm.value = { ...data }
        }
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
        await saveGenTemplateGroup(addUpdateForm.value)
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
        await updateGenTemplateGroup({ ...addUpdateForm.value })
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
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...GenTemplateGroupOperationForm }
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
