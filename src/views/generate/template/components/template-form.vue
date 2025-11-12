<template>
  <el-form
    ref="addUpdateFormRef"
    v-loading="loadingStatus"
    :model="addUpdateForm"
    :rules="rules"
    element-loading-text="拼命加载中"
    label-width="100px"
    class="flex h-full"
    style="flex-direction: column"
    scroll-to-error
    inline-message
  >
    <el-row>
      <el-col :span="6">
        <el-form-item label="模板名称" prop="templateName">
          <el-input
            v-model="addUpdateForm.templateName"
            :maxlength="20"
            show-word-limit
            placeholder="请输入模板名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="文件名" prop="templateFileName">
          <el-input
            v-model="addUpdateForm.templateFileName"
            :maxlength="100"
            show-word-limit
            placeholder="请输入文件名模板"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="文件类型" prop="templateFileType">
          <el-select v-model="addUpdateForm.templateFileType" placeholder="请选择文件类型">
            <el-option label="java" value="java" />
            <el-option label="vue" value="vue" />
            <el-option label="ts" value="ts" />
            <el-option label="ts" value="js" />
            <el-option label="sql" value="sql" />
            <el-option label="xml" value="xml" />
            <el-option label="txt" value="txt" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="模板排序" prop="templateSort">
          <el-input-number
            v-model="addUpdateForm.templateSort"
            class="w-full!"
            :min="0"
            :max="999"
            placeholder="请输入模板排序"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="文件路径" prop="templateFilePath">
          <el-input
            v-model="addUpdateForm.templateFilePath"
            :max="500"
            show-word-limit
            placeholder="请输入文件路径模板"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="忽略字段" prop="templateIgnoreField">
          <el-select
            multiple
            filterable
            :allow-create="false"
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="2"
            v-model="addUpdateForm.templateIgnoreField"
            placeholder="请输入忽略字段"
          >
            <el-option label="id" value="id" />
            <el-option label="tenantId" value="tenant_id" />
            <el-option label="version" value="version" />
            <el-option label="createBy" value="create_by" />
            <el-option label="createTime" value="create_time" />
            <el-option label="updateBy" value="update_by" />
            <el-option label="updateTime" value="update_time" />
            <el-option label="delFlag" value="del_flag" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4" class="text-center">
        <el-button :disabled="loadingStatus" type="primary" @click="submitForm">
          {{ addUpdateForm.isNew ? '保存模板' : '修改模板' }}
        </el-button>
      </el-col>
    </el-row>
    <el-form-item
      :error="validateStatus ? '请输入模板内容' : ''"
      class="flex-1"
      label="模板内容"
      prop="templateContent"
    >
      <code-monaco-editor
        v-model="addUpdateForm.templateContent"
        :language="addUpdateForm.templateFileType"
        :validate-status="validateStatus"
        @change="codeChange"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import {
  GenTemplateOperationForm,
  GenTemplateOperationRules,
} from '@/views/generate/template/template.data'
import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'
import { useMessage } from '@/hooks/use-message'
import { saveGenTemplate, updateGenTemplate } from '@/service/api/generate/template.api'

defineOptions({
  name: 'TemplateForm',
  inheritAttrs: false,
})
const emits = defineEmits(['success'])
const loadingStatus = defineModel<boolean>('loadingStatus', {
  required: true,
  default: false,
})
const addUpdateForm = defineModel<GenTemplateOperationRequest>('addUpdateForm', {
  required: true,
  default: {
    ...GenTemplateOperationForm,
  },
})
const validateStatus = ref<boolean>(false)
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules = GenTemplateOperationRules
const submitForm = () => {
  loadingStatus.value = true
  addUpdateFormRef.value?.validate(async (valid, invalidFields) => {
    validateStatus.value = !!(
      invalidFields?.templateContent && invalidFields?.templateContent.length > 0
    )
    if (valid) {
      if (addUpdateForm.value.isNew) {
        await saveGenTemplate({ ...addUpdateForm.value, id: null })
          .then((res) => {
            addUpdateForm.value.isNew = false
            addUpdateForm.value.id = res.data
            emits('success', res.data)
            useMessage().success('保存模板成功')
          })
          .finally(() => {
            loadingStatus.value = false
          })
      } else {
        await updateGenTemplate(addUpdateForm.value)
          .then(() => {
            useMessage().success('修改模板成功')
          })
          .finally(() => {
            loadingStatus.value = false
          })
      }
      loadingStatus.value = false
    } else {
      loadingStatus.value = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}
/**
 * 模板内容改变
 * @param value 改变后的内容
 */
const codeChange = (value?: string) => {
  validateStatus.value = !value
}
</script>

<style scoped lang="scss"></style>
