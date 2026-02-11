<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysOauth2ClientById, saveSysOauth2Client, updateSysOauth2Client } from '@/service/api/system/oauth2.client.api'
import type { SysOauth2ClientOperationRequest } from '@/service/model/system/oauth2.client.model'
import { sysOauth2ClientOperationForm, sysOauth2ClientOperationRules } from '@/views/system/oauth2-client/oauth2.client.data'
import { useMessage } from '@/hooks/use-message'
import { authorizationGrantTypesEnums, autoApproveEnums, clientAuthenticationMethodsEnums } from '@/service/enums/system/oauth2.enum'

defineOptions({ name: 'SysOauth2ClientAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysOauth2ClientOperationRequest>>({
  title: '增加客户端',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysOauth2ClientOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysOauth2ClientOperationRequest>> = sysOauth2ClientOperationRules
const authorizationGrantTypesStatus = computed<boolean>(() => {
  return addUpdateForm.value.authorizationGrantTypes ? addUpdateForm.value.authorizationGrantTypes.includes('authorization_code') : false
})

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改客户端'
      const { data } = await querySysOauth2ClientById(id)
      addUpdateForm.value = { ...data }
    }
    state.loadingStatus = false
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
        addUpdateForm.value = { ...addUpdateForm.value }
        if (state.operationStatus === 'create') {
          await saveSysOauth2Client(addUpdateForm.value)
          useMessage().success(`新增系统管理-客户端管理成功`)
        } else {
          await updateSysOauth2Client(addUpdateForm.value)
          useMessage().success(`修改系统管理-客户端管理成功`)
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
    size="65%"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户端标识" prop="clientId">
            <el-input v-model="addUpdateForm.clientId" clearable :maxlength="100" show-word-limit placeholder="请输入客户端标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端名称" prop="clientName">
            <el-input v-model="addUpdateForm.clientName" clearable :maxlength="100" show-word-limit placeholder="请输入客户端名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="state.operationStatus === 'create'">
          <el-form-item label="客户端密钥" prop="clientSecret">
            <el-input v-model="addUpdateForm.clientSecret" type="password" show-password placeholder="请输入客户端密钥" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证方式" prop="clientAuthenticationMethods">
            <xht-enum-select
              v-model="addUpdateForm.clientAuthenticationMethods"
              :data="clientAuthenticationMethodsEnums"
              multiple
              :max-collapse-tags="1"
              clearable
              placeholder="请输入客户端认证方式"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权类型" prop="authorizationGrantTypes">
            <xht-enum-select
              v-model="addUpdateForm.authorizationGrantTypes"
              :data="authorizationGrantTypesEnums"
              multiple
              :max-collapse-tags="1"
              clearable
              placeholder="请选择客户端授权类型"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="令牌时效" prop="accessTokenValidity">
            <el-input-number
              v-model="addUpdateForm.accessTokenValidity"
              class="w-full!"
              :min="10 * 60"
              value-on-clear="min"
              placeholder="请输入请求令牌时效"
            >
              <template #suffix>秒</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刷新时效" prop="refreshTokenValidity">
            <el-input-number
              v-model="addUpdateForm.refreshTokenValidity"
              class="w-full!"
              :min="10 * 60"
              value-on-clear="min"
              placeholder="请输入刷新令牌时效"
            >
              <template #suffix>秒</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="clientIdIssuedAt">
            <el-date-picker
              disabled
              v-model="addUpdateForm.clientIdIssuedAt"
              class="w-full!"
              format="YYYY-MM-DD hh:mm:ss"
              placeholder="选择客户端发布时间"
              type="date"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="过期时间" prop="clientSecretExpiresAt">
            <el-date-picker
              v-model="addUpdateForm.clientSecretExpiresAt"
              class="w-full!"
              format="YYYY-MM-DD hh:mm:ss"
              placeholder="选择客户端过期时间"
              type="date"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="作用域" prop="scopes">
            <el-input-tag
              v-model="addUpdateForm.scopes"
              draggable
              tag-effect="light"
              tag-type="danger"
              collapse-tags
              :max-collapse-tags="3"
              collapse-tags-tooltip
              placeholder="请输入客户端作用域"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="authorizationGrantTypesStatus">
          <el-form-item label="重定向地址" prop="redirectUris">
            <el-input-tag
              v-model="addUpdateForm.redirectUris"
              draggable
              tag-effect="light"
              tag-type="success"
              collapse-tags
              :max-collapse-tags="3"
              collapse-tags-tooltip
              placeholder="请输入重定向地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="authorizationGrantTypesStatus">
          <el-form-item label="自动放行" prop="autoApprove">
            <xht-enum-select v-model="addUpdateForm.autoApprove" :data="autoApproveEnums" clearable placeholder="请选择自动放行状态" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="addUpdateForm.remark"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              :maxlength="200"
              show-word-limit
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
