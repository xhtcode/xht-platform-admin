<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { UpdatePwdFrom } from '@/service/model/system/user.model'
import { updatePassword } from '@/service/api/system/user.api'
import { useMessage } from '@/hooks/use-message'
import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'UpdatePassword',
})
const state = reactive({
  loadingStatus: false,
})

const permissions = useUserInfoStore()
const { userInfo } = storeToRefs(permissions)

// 表单数据
const form = reactive<UpdatePwdFrom>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const formRef = useTemplateRef('formRef')

// 表单验证规则
const rules: FormRules<Required<UpdatePwdFrom>> = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能少于6位', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value && value !== form.confirmPassword && form.confirmPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, message: '确认密码长度不能少于6位', trigger: 'blur' },
    {
      validator: (_: any, value: string, callback: any) => {
        if (value && value !== form.newPassword && form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 提交表单
const handleSubmit = () => {
  state.loadingStatus = true
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      updatePassword(form)
        .then((_) => {
          useMessage().success('修改密码成功')
          formRef.value?.resetFields()
        })
        .finally(() => {
          state.loadingStatus = false
        })
    } else {
      useMessage().error('表单校验未通过，请重新检查提交内容')
      state.loadingStatus = false
    }
  })
}
/**
 * 重置表单
 */
const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="xht-view-container user-select-none">
    <el-splitter>
      <el-splitter-panel :resizable="false" class="flex flex-col">
        <el-divider content-position="center">
          <h3 class="font-bold">修改密码</h3>
        </el-divider>
        <div class="p-6">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="flex-1">
            <!-- 用户名 -->
            <el-form-item label="用户名" class="hidden">
              <el-input v-model="userInfo.userName" placeholder="请输入用户名" disabled />
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item label="昵称" class="hidden">
              <el-input v-model="userInfo.nickName" placeholder="请输入昵称" disabled />
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item label="手机号" class="hidden">
              <el-input v-model="userInfo.userPhone" placeholder="请输入手机号" disabled />
            </el-form-item>
            <!-- 注册日期 -->
            <el-form-item label="注册日期" class="hidden">
              <el-input v-model="userInfo.registerDate" placeholder="请输入注册日期" disabled />
            </el-form-item>
            <!-- 旧密码 -->
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" show-password />
            </el-form-item>

            <!-- 新密码 -->
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" placeholder="请输入新密码（至少6位）" type="password" show-password />
            </el-form-item>

            <!-- 确认新密码 -->
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" placeholder="请再次输入新密码" type="password" show-password />
            </el-form-item>
            <!-- 确认修改按钮 -->
            <div class="text-right">
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleSubmit">修改</el-button>
            </div>
          </el-form>
        </div>
      </el-splitter-panel>
      <el-splitter-panel :resizable="false">
        <el-divider content-position="center">
          <h3 class="font-bold">授权管理</h3>
        </el-divider>
        <div class="p-6">
          <el-alert title="修改密码成功" type="success" show-icon>
            <template #default>请重新登录</template>
          </el-alert>
        </div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<style scoped lang="scss"></style>
