<template>
  <el-form
    ref="addUpdateFormRef"
    v-loading="loadingStatus"
    :model="addUpdateForm"
    :rules="rules"
    element-loading-text="拼命加载中"
    label-width="100px"
    class="flex h-full flex-direction-column"
  >
    <div>
      <el-row>
        <el-col :span="6">
          <el-form-item label="模板名称" prop="templateName">
            <el-input
              v-model="addUpdateForm.templateName"
              :max="10"
              show-word-limit
              placeholder="请输入模板名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文件名" prop="templateFileName">
            <el-input v-model="addUpdateForm.templateFileName" placeholder="请输入文件名模板" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文件类型" prop="templateFileType">
            <el-select v-model="addUpdateForm.templateFileType" placeholder="请选择文件类型">
              <el-option label="java" value="java"></el-option>
              <el-option label="vue" value="vue"></el-option>
              <el-option label="ts" value="ts"></el-option>
              <el-option label="ts" value="js"></el-option>
              <el-option label="sql" value="sql"></el-option>
              <el-option label="txt" value="txt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="模板排序" prop="templateSort">
            <el-input-number
              v-model="addUpdateForm.templateSort"
              class="w100"
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
            <el-input v-model="addUpdateForm.templateIgnoreField" placeholder="请输入忽略字段" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="text-center">
          <el-button :disabled="loadingStatus" type="primary" @click="submitForm">
            保存/修改
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-form-item class="h100" label="模板内容" prop="templateContent">
      <code-monaco-editor
        v-model="addUpdateForm.templateContent"
        :language="addUpdateForm.templateFileType"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import {
  GenTemplateOperationForm,
  GenTemplateOperationRules,
} from '@/views/generate/template/template.data'
import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'

defineOptions({
  name: 'TemplateForm',
  inheritAttrs: false,
})
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
const rules: FormRules = GenTemplateOperationRules
const submitForm = () => {}
</script>

<style scoped lang="scss"></style>
