<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { useUserInfoStore } from '@/store/modules/user.store'
import { generatePhoneSmsCode } from '@/service/api/login/login.api'
import { SMS_RESEND_INTERVAL } from '@/service/constant'
import type { PhoneLoginFormType } from '@/service/model/login/login.model'
import { resolveLoginRedirect } from '@/views/login/login-redirect'
import { useRoute, useRouter } from 'vue-router'
import { Phone } from '@element-plus/icons-vue'

defineOptions({ name: 'PhoneForm' })

/**
 * 手机号验证码登录
 *
 * 流程：发送短信验证码（重发间隔由 SMS_RESEND_INTERVAL 配置）→ 校验手机号与验证码 → 登录换取令牌
 * → 跳转 redirect 指定页面或首页。登录成功后的用户信息与动态路由由路由守卫统一加载。
 */

const route = useRoute()
const router = useRouter()
const userInfoStore = useUserInfoStore()
const phoneFormRef = useTemplateRef<FormInstance>('phoneFormRef')

// 手机号登录表单
const phoneForm = reactive<PhoneLoginFormType>({
  phone: '',
  phoneCode: '',
})

const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  phoneCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

// 登录请求状态
const loginLoading = ref<boolean>(false)
// 验证码发送状态
const smsLoading = ref<boolean>(false)
// 重发倒计时剩余秒数
const countdown = ref<number>(0)
let countdownTimer: ReturnType<typeof setInterval> | undefined

/**
 * 提取纯数字
 *
 * 手机号与验证码只允许数字：粘贴或输入法带入的空格、`+`、`-` 等字符直接过滤，
 * 避免填完提交时才被表单规则或后端拒绝。
 *
 * @param value 原始输入值
 * @returns 仅保留数字的字符串
 */
const onlyDigits = (value: string): string => value.replace(/\D/g, '')

/**
 * 启动重发倒计时
 */
const startCountdown = () => {
  countdown.value = SMS_RESEND_INTERVAL
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearCountdown()
    }
  }, 1000)
}

/**
 * 清除重发倒计时
 */
const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = undefined
  }
  countdown.value = 0
}

onUnmounted(clearCountdown)

/**
 * 发送短信验证码
 *
 * 仅在手机号校验通过后请求，成功后进入倒计时，避免频繁请求造成短信轰炸。
 */
const sendSMS = async () => {
  if (smsLoading.value || countdown.value > 0 || !phoneFormRef.value) {
    return
  }
  try {
    await phoneFormRef.value.validateField('phone')
  } catch {
    // 手机号校验未通过，交由表单展示错误信息
    return
  }
  smsLoading.value = true
  try {
    await generatePhoneSmsCode(phoneForm.phone)
    useMessage().success('验证码已发送，请注意查收')
    startCountdown()
  } catch {
    // 错误提示由请求拦截器统一给出，失败后允许立即重试
  } finally {
    smsLoading.value = false
  }
}

/**
 * 手机号登录
 */
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) {
    return
  }
  try {
    await phoneFormRef.value.validate()
  } catch {
    useMessage().error('请填写完整的登录信息')
    return
  }
  loginLoading.value = true
  try {
    await userInfoStore.loginByPhone({
      phone: phoneForm.phone,
      phoneCode: phoneForm.phoneCode,
    })
    // 会话失效后重新登录时回到原地址，否则回首页
    await router.replace({ path: resolveLoginRedirect(route.query) })
    useMessage().success('登录成功，已为您加载专属工作台，开始工作吧～ !')
  } catch {
    // 错误提示由请求拦截器统一给出，此处不再重复提示
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <el-form
    ref="phoneFormRef"
    v-loading="loginLoading"
    :model="phoneForm"
    :rules="phoneRules"
    inline-message
    size="default"
    @keyup.enter="handlePhoneLogin"
  >
    <el-form-item prop="phone">
      <el-input
        v-model="phoneForm.phone"
        class="login-input"
        :maxlength="11"
        show-word-limit
        placeholder="请输入手机号"
        :prefix-icon="Phone"
        inputmode="numeric"
        size="large"
        @input="(value: string) => (phoneForm.phone = onlyDigits(value))"
      />
    </el-form-item>

    <el-form-item prop="phoneCode">
      <div class="sms-container">
        <el-input
          v-model="phoneForm.phoneCode"
          class="login-input"
          :maxlength="6"
          placeholder="请输入验证码"
          inputmode="numeric"
          size="large"
          @input="(value: string) => (phoneForm.phoneCode = onlyDigits(value))"
        >
          <template #prefix>
            <div class="i-login-code h-1rem w-1rem color-[var(--color)]" />
          </template>
        </el-input>
        <el-button :disabled="countdown > 0" :loading="smsLoading" class="sms-button" size="large" type="primary" plain @click="sendSMS">
          {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
        </el-button>
      </div>
    </el-form-item>
    <el-button :loading="loginLoading" class="login-button" size="large" type="primary" @click="handlePhoneLogin">登录</el-button>
    <div class="text-center text-12px color-[var(--el-text-color-placeholder)]">未注册的手机号将自动创建账号</div>
  </el-form>
</template>

<style lang="scss" scoped>
.login-input {
  :deep(.el-input__wrapper) {
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    box-shadow: none;

    &:hover {
      border-color: var(--el-border-color);
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
