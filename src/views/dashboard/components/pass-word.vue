<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from '@/hooks/use-message'

// 表单数据
const form = reactive({
  phone: '',
  verifyCode: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单实例
const formRef = useTemplateRef('formRef')

// 成功提示
const showSuccess = ref(false)

// 验证码倒计时
const countdown = ref(0)
const canSendCode = ref(true)

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度必须为6位', trigger: 'blur' },
  ],
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, message: '确认密码长度不能少于6位', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 发送验证码
const sendVerifyCode = () => {
  // 验证手机号
  if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
    useMessage().error('请输入正确的手机号')
    return
  }

  // 模拟发送验证码
  canSendCode.value = false
  countdown.value = 60

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      canSendCode.value = true
    }
  }, 1000)
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 模拟修改密码成功
      showSuccess.value = true

      // 重置表单
      formRef.value?.resetFields()

      // 3秒后关闭成功提示
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    }
  })
}
</script>

<template>
  <div class="mx-auto max-w-[500px] w-full p-5">
    <!-- 成功提示 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="w-full">
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

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" type="tel" maxlength="11" show-word-limit />
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item label="验证码" prop="verifyCode">
        <div class="flex gap-3">
          <el-input v-model="form.verifyCode" placeholder="请输入验证码" maxlength="6" show-word-limit class="flex-1" />
          <el-button type="primary" plain :disabled="!canSendCode" @click="sendVerifyCode">
            {{ canSendCode ? '获取验证码' : `${countdown}s后重新发送` }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 确认修改按钮 -->
    <div class="flex justify-end">
      <el-button type="primary" @click="handleSubmit" size="large">确认修改</el-button>
    </div>
  </div>
</template>
