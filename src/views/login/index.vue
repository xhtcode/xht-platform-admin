<template>
  <div class="login">
    <!-- 登录页头部 -->
    <div class="login-header">
      <div class="flex-y-center">
        <el-switch inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleTheme" />
      </div>
    </div>
    <!-- 登录页内容 -->
    <div class="login-form">
      <div v-for="item in 10" :key="item">
        <context-menu2>
          <el-tag>测试{{ item }}</el-tag>
        </context-menu2>
      </div>
      <el-form ref="loginFormRef" :model="loginFormData" :rules="loginRules">
        <div class="form-title">
          <h2>小糊涂管理系统</h2>
        </div>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginFormData.username"
            prefix-icon="UserFilled"
            placeholder="用户名"
            name="username"
            size="large"
            class="h-[48px]"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-tooltip :visible="isCapslock" content="大写锁定已打开" placement="right">
          <el-form-item prop="password">
            <el-input
              v-model="loginFormData.password"
              prefix-icon="Lock"
              placeholder="密码"
              type="password"
              name="password"
              size="large"
              class="h-[48px] pr-2"
              show-password
              @keyup="checkCapslock"
              @keyup.enter="handleLoginSubmit"
            />
          </el-form-item>
        </el-tooltip>

        <!-- 验证码 -->
        <el-form-item prop="captchaCode">
          <div class="input-wrapper">
            <div class="i-svg:captcha mx-2" />
            <el-input
              v-model="loginFormData.captchaCode"
              prefix-icon="Burger"
              auto-complete="off"
              size="large"
              class="flex-1"
              placeholder="验证码"
              @keyup.enter="handleLoginSubmit"
            />
            <el-image :src="captchaBase64" class="captcha-img" @click="getCaptcha" />
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="w100"
          @click.prevent="handleLoginSubmit"
        >
          登录
        </el-button>
      </el-form>
    </div>

    <!-- 登录页底部 -->
    <div class="login-footer">
      <el-text size="small">
        小糊涂快速开发平台
        <a href="https://www.baidu.com/" target="_blank">前往官网</a>
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { generateCaptcha } from '@/api/login/api'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useMessage } from '@/hooks/use-message'
import { useRouter } from 'vue-router'
import { HOME_PAGE_PATH } from '@/common/constant'
import { toggleDark } from '@/utils/dark'
import ContextMenu2 from '@/components/context-menu/index2.vue'

const loginFormRef = ref<FormInstance>()
defineOptions({
  name: 'LoginIndex',
})
const loading = ref(false) // 按钮 loading 状态
const isCapslock = ref(false) // 是否大写锁定
const captchaBase64 = ref<string | undefined>() // 验证码图片Base64字符串
const userInfoStore = useUserInfoStore()
const router = useRouter()
const loginFormData = ref<any>({
  username: 'admin',
  password: '123456',
  captchaKey: '',
  captchaCode: '',
})

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入用户名',
      },
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入密码',
      },
      {
        min: 6,
        message: '密码长度不能小于6位',
        trigger: 'blur',
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入验证码',
      },
    ],
  }
})

// 获取验证码
function getCaptcha() {
  generateCaptcha(loginFormData.value.captchaKey).then((res) => {
    captchaBase64.value = res.data.code
    loginFormData.value.captchaKey = res.data.key
  })
}

// 登录
async function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      userInfoStore
        .login({ ...loginFormData.value })
        .then(() => {
          useMessage().success('登录成功')
          router.push({ path: HOME_PAGE_PATH })
        })
        .catch(() => {
          getCaptcha()
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      useMessage().error('请填写页面提示的内容！')
    }
  })
}

// 主题切换
const toggleTheme = () => {
  toggleDark()
}

// 检查输入大小写
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState('CapsLock')
  }
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;

  .login-header {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: right;
    width: 100%;
    padding: 15px;

    .logo {
      width: 26px;
      height: 26px;
    }

    .title {
      margin: auto 5px;
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 460px;
    padding: 40px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-light);

    @media (width <= 460px) {
      width: 100%;
      padding: 20px;
    }

    .form-title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 20px;
      text-align: center;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .captcha-img {
      height: 48px;
      cursor: pointer;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  .login-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    text-align: center;
  }
}

:deep(.el-form-item) {
  background: var(--el-input-bg-color);
  border: 1px solid var(--xht-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}

html.dark {
  .login {
    //background: url('@/assets/images/login-bg-dark.jpg') no-repeat center right;
    background: #101f1c;

    .login-form {
      background: transparent;
      box-shadow: var(--el-box-shadow);
    }
  }
}
</style>
