<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { generateCaptcha } from '@/service/api/login/login.api'
import { useMessage } from '@/hooks/use-message'
import { useUserInfoStore } from '@/store/modules/user.store'
import { HOME_PAGE_PATH } from '@/service/constant'
import { useRouter } from 'vue-router'
import type { LoginRequestType } from '@/service/model/login/login.model'
import { Lock, User } from '@element-plus/icons-vue'

defineOptions({ name: 'PasswordForm' })

// 账号密码登录表单
const loginForm = reactive<LoginRequestType>({
  username: 'admin',
  password: '123456',
  captcha_code: '',
  captcha_key: '',
})
const loading = ref<boolean>(false)
const router = useRouter()
// 表单验证规则
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }],
  captcha_code: [{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] }],
}
// 验证码相关
const captchaUrl = ref<string>('')
const userInfoStore = useUserInfoStore()
// 表单引用
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')
/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
  loading.value = true
  generateCaptcha(loginForm.captcha_key)
    .then((res) => {
      captchaUrl.value = `data:image/png;base64,${res.data.code}`
      loginForm.captcha_key = res.data.key
    })
    .finally(() => {
      loading.value = false
    })
}

// 登录处理
const handleLogin = async () => {
  loading.value = true
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      userInfoStore
        .login({
          username: loginForm.username,
          password: loginForm.password,
          captcha_code: loginForm.captcha_code,
          captcha_key: loginForm.captcha_key,
        })
        .then(() => {
          router
            .push({ path: HOME_PAGE_PATH })
            .then(() => {
              useMessage().success('登录成功，已为您加载专属工作台，开始工作吧～ !')
            })
            .catch(() => {
              useMessage().error('登录失败，请稍后再试！')
            })
            .finally(() => {
              loading.value = false
            })
        })
        .catch(() => {
          refreshCaptcha()
        })
    } else {
      loading.value = false
    }
  })
}
onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <el-form ref="loginFormRef" v-loading="loading" :model="loginForm" :rules="loginRules" inline-message size="default" @keyup.enter="handleLogin">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" class="login-input" placeholder="请输入用户名" :prefix-icon="User" size="large" />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        class="login-input"
        placeholder="请输入密码"
        :prefix-icon="Lock"
        show-password
        size="large"
        type="password"
      />
    </el-form-item>
    <el-form-item prop="captcha_code">
      <div class="captcha-container">
        <el-input v-model.number="loginForm.captcha_code" class="login-input" placeholder="验证码">
          <template #prefix>
            <div class="i-login-code h-1rem w-1rem color-[var(--color)]" />
          </template>
        </el-input>
        <div class="captcha-image" @click="refreshCaptcha">
          <el-image :src="captchaUrl" alt="验证码" fit="fill" style="width: 100%; height: 100%; object-fit: cover" />
        </div>
      </div>
    </el-form-item>

    <el-button :loading="loading" class="login-button" size="large" type="primary" @click="handleLogin">登录</el-button>
    <!-- 忘记密码 -->
    <div class="text-right">
      <router-link class="text-14px color-#3b82f6 font-500 decoration-none" to="/">忘记密码</router-link>
    </div>
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

.captcha-container {
  display: flex;
  align-items: stretch;
  gap: 12px;
  width: 100%;
}

.captcha-image {
  flex-shrink: 0;
  width: 120px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
}
</style>
