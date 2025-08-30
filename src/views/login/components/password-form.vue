<template>
  <el-form size="default" :model="loginForm" :rules="loginRules" ref="loginFormRef">
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        placeholder="请输入用户名"
        size="large"
        prefix-icon="User"
        class="login-input"
      />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="请输入密码"
        size="large"
        prefix-icon="Lock"
        class="login-input"
        show-password
      />
    </el-form-item>
    <el-form-item prop="code">
      <div class="captcha-container">
        <el-input v-model="loginForm.code" placeholder="验证码" class="login-input">
          <template #prefix>
            <div class="i-icon-code h-1rem w-1rem color-[var(--color)]" />
          </template>
        </el-input>
        <div class="captcha-image" @click="refreshCaptcha">
          <el-image
            fit="fill"
            :src="captchaUrl"
            alt="验证码"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </div>
      </div>
    </el-form-item>

    <el-button
      type="primary"
      size="large"
      class="login-button"
      @click="handleLogin"
      :loading="loading"
    >
      登录
    </el-button>
    {{ userInfoStore.token }}
    <!-- 忘记密码 -->
    <div class="text-right">
      <router-link to="/" class="text-14px color-#3b82f6 font-500 decoration-none">
        忘记密码
      </router-link>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { generateCaptcha } from '@/api/login/api'
import { useMessage } from '@/hooks/use-message.ts'
import { useUserInfoStore } from '@/store/modules/user.store.ts'
import { HOME_PAGE_PATH } from '@/common/constant'
import { useRouter } from 'vue-router'
import type { LoginRequestType } from '@/api/login/type.ts'

defineOptions({ name: 'PasswordForm' })

// 账号密码登录表单
const loginForm = reactive<LoginRequestType>({
  username: 'admin',
  password: '123456',
  code: '',
  uuid: '',
  timeout: 0,
})
const loading = ref(false)
const router = useRouter()
// 表单验证规则
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}
// 验证码相关
const captchaUrl = ref<string>('')
const userInfoStore = useUserInfoStore()
/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
  generateCaptcha(loginForm.uuid).then((res) => {
    captchaUrl.value = res.data.code
    loginForm.uuid = res.data.key
  })
}
// 表单引用
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')
// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) {
    return
  }

  try {
    await loginFormRef.value.validate()
    loading.value = true
    userInfoStore
      .login({
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code,
        uuid: loginForm.uuid,
        timeout: 10000,
      })
      .then(() => {
        useMessage().success('登录成功 !')
        router.push({ path: HOME_PAGE_PATH })
      })
      .catch(() => {
        refreshCaptcha()
      })
      .finally(() => {
        loading.value = false
      })
    loading.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
onMounted(() => {
  refreshCaptcha()
})
</script>
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
