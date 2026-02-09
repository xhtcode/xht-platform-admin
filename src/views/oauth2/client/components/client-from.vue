<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysOauth2ClientById, saveSysOauth2Client, updateSysOauth2Client } from '@/service/api/oauth2/client.api'
import type { SysOauth2ClientOperationRequest } from '@/service/model/oauth2/client.model'
import { sysOauth2ClientOperationForm, sysOauth2ClientOperationRules } from '@/views/oauth2/client/client.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'SysOauth2ClientAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysOauth2ClientOperationRequest>>({
  title: '增加系统管理-客户端管理',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysOauth2ClientOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysOauth2ClientOperationRequest>> = sysOauth2ClientOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改系统管理-客户端管理'
      const { data } = await querySysOauth2ClientById(id)
      addUpdateForm.value = data
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
      label-width="120px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户端ID" prop="clientId">
            <el-input v-model="addUpdateForm.clientId" clearable :maxlength="100" show-word-limit placeholder="请输入客户端ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端发布时间" prop="clientIdIssuedAt">
            <el-date-picker
              v-model="addUpdateForm.clientIdIssuedAt"
              format="YYYY-MM-DD"
              placeholder="选择客户端发布时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端密钥" prop="clientSecret">
            <el-input v-model="addUpdateForm.clientSecret" clearable :maxlength="100" show-word-limit placeholder="请输入客户端密钥" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端过期时间" prop="clientSecretExpiresAt">
            <el-date-picker
              v-model="addUpdateForm.clientSecretExpiresAt"
              format="YYYY-MM-DD"
              placeholder="选择客户端过期时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端名称" prop="clientName">
            <el-input v-model="addUpdateForm.clientName" clearable :maxlength="100" show-word-limit placeholder="请输入客户端名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户认证方式" prop="clientAuthenticationMethods">
            <el-input
              v-model="addUpdateForm.clientAuthenticationMethods"
              clearable
              :maxlength="100"
              show-word-limit
              placeholder="请输入客户认证方式"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端授权类型" prop="authorizationGrantTypes">
            <el-input v-model="addUpdateForm.authorizationGrantTypes" clearable :maxlength="100" show-word-limit placeholder="请输入客户端授权类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权后重定向URI" prop="redirectUris">
            <el-input v-model="addUpdateForm.redirectUris" clearable :maxlength="100" show-word-limit placeholder="请输入授权后重定向URI" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登出后重定向URI" prop="postLogoutRedirectUris">
            <el-input v-model="addUpdateForm.postLogoutRedirectUris" clearable :maxlength="100" show-word-limit placeholder="请输入登出后重定向URI" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端作用域" prop="scopes">
            <el-input v-model="addUpdateForm.scopes" clearable :maxlength="100" show-word-limit placeholder="请输入客户端作用域" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求令牌有效时间" prop="accessTokenValidity">
            <el-date-picker
              v-model="addUpdateForm.accessTokenValidity"
              format="YYYY-MM-DD"
              placeholder="选择请求令牌有效时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刷新令牌有效时间" prop="refreshTokenValidity">
            <el-date-picker
              v-model="addUpdateForm.refreshTokenValidity"
              format="YYYY-MM-DD"
              placeholder="选择刷新令牌有效时间"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扩展信息" prop="additionalInformation">
            <el-input v-model="addUpdateForm.additionalInformation" clearable :maxlength="100" show-word-limit placeholder="请输入扩展信息" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否自动放行" prop="autoApprove">
            <el-input v-model="addUpdateForm.autoApprove" clearable :maxlength="100" show-word-limit placeholder="请输入是否自动放行" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addUpdateForm.remark" clearable :maxlength="100" show-word-limit placeholder="请输入备注" />
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
