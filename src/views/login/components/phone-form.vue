<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { Phone } from '@element-plus/icons-vue'

defineOptions({ name: 'PhoneForm' })

/**
 * 手机号登录（界面占位）
 *
 * 说明：当前未接入后端短信服务与手机号登录接口，因此不提供真实的登录能力。
 * 接入前提：
 * 1. 后端提供「发送短信验证码」接口，sendSMS 中补齐请求与倒计时；
 * 2. 后端提供「手机号登录」接口，handlePhoneLogin 中补齐 token 写入（userStore.login）
 *    与登录后跳转（含 redirect 回跳）。
 * 在接口就绪前，此处只保留界面与明确提示，避免出现"点击即登录成功"的误导。
 */
const UNAVAILABLE_TIP = '手机登录暂未开放，请使用账号密码登录'

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

// 发送短信验证码（占位）
const sendSMS = () => {
  useMessage().warning('短信服务暂未接入，暂不可用')
}

// 手机登录（占位）
const handlePhoneLogin = () => {
  useMessage().warning(UNAVAILABLE_TIP)
}
</script>

<template>
  <el-form :model="phoneForm" :rules="phoneRules" size="default">
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
        <el-button class="sms-button" size="large" type="primary" plain @click="sendSMS">发送验证码</el-button>
      </div>
    </el-form-item>
    <el-button class="login-button" size="large" type="primary" @click="handlePhoneLogin">登录</el-button>
    <div class="text-center text-12px color-#9ca3af">手机登录暂未开放，请使用账号密码登录</div>
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
