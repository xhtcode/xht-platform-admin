<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { Phone } from '@element-plus/icons-vue'

defineOptions({ name: 'PhoneForm' })
const loading = ref(false)
const phoneFormRef = ref<FormInstance>()
// 短信验证码倒计时
const smsCountdown = ref(0)
// 手机登录表单
const phoneForm = reactive({
  phone: '',
  code: '',
})
const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}
// 发送短信验证码
const sendSMS = async () => {
  if (!phoneForm.phone || !/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    useMessage().error('请输入正确的手机号')
    return
  }

  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  // 这里添加实际的发送短信逻辑
  useMessage().success('验证码已发送')
}
// 手机登录处理
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) {
    return
  }

  try {
    await phoneFormRef.value.validate()
    loading.value = true

    // 这里添加实际的手机登录逻辑
    console.log('手机登录:', phoneForm)

    // 模拟登录请求
    setTimeout(() => {
      loading.value = false
      useMessage().success('手机登录成功！')
      // 登录成功后的处理
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<template>
  <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" size="default">
    <el-form-item :inline-message="false" :show-message="false" prop="phone">
      <el-input v-model="phoneForm.phone" class="login-input" placeholder="请输入手机号" :prefix-icon="Phone" size="large" />
    </el-form-item>

    <el-form-item prop="code">
      <div class="sms-container">
        <el-input v-model="phoneForm.code" class="login-input" placeholder="请输入验证码" size="large">
          <template #prefix>
            <div class="i-login-code h-1rem w-1rem color-[var(--color)]" />
          </template>
        </el-input>
        <el-button :disabled="smsCountdown > 0" class="sms-button" size="large" type="primary" @click="sendSMS">
          {{ smsCountdown > 0 ? `${smsCountdown}s` : '发送验证码' }}
        </el-button>
      </div>
    </el-form-item>
    <el-button :loading="loading" class="login-button" size="large" type="primary" @click="handlePhoneLogin">登录</el-button>
  </el-form>
</template>

<style lang="scss" scoped>
.login-input {
  :deep(.el-input__wrapper) {
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    box-shadow: none;

    &:hover {
      border-color: #d1d5db;
    }

    &.is-focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  }

  :deep(.el-input__inner) {
    height: 32px;
    font-size: 0.8rem;
  }
}

.login-button {
  width: 100%;
  height: 32px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 5px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  margin-bottom: 0.6rem;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.sms-container {
  display: flex;
  gap: 0.5rem;

  .sms-button {
    width: 120px;
    height: 32px;
    flex-shrink: 0;
    font-size: 0.75rem;
    padding: 0 0.5rem;
  }
}
</style>
