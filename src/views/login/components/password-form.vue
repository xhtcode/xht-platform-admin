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
    <el-form-item prop="captcha">
      <div class="captcha-container">
        <el-input v-model="loginForm.captcha" placeholder="验证码" class="login-input">
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

defineOptions({ name: 'PasswordForm' })

// 账号密码登录表单
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
})
const loading = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}
// 验证码相关
const captchaUrl = ref(
  'data:image/png;base64,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'
)
// 刷新验证码
const refreshCaptcha = () => {
  // 这里添加实际的刷新验证码逻辑
  console.log('刷新验证码')
  // 实际项目中应该调用接口获取新的验证码
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

    // 这里添加实际的登录逻辑
    console.log('账号密码登录:', loginForm)

    // 模拟登录请求
    setTimeout(() => {
      loading.value = false
      ElMessage.success('登录成功！')
      // 登录成功后的处理，如跳转到首页
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
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
