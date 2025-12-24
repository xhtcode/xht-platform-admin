<script lang="ts" setup>
import { useMessage } from '@/hooks/use-message'

defineOptions({
  name: 'Login',
  inheritAttrs: false,
})

const passwordForm = defineAsyncComponent(() => import('@/views/login/components/password-form.vue'))
const phoneForm = defineAsyncComponent(() => import('@/views/login/components/phone-form.vue'))
const qrcodeForm = defineAsyncComponent(() => import('@/views/login/components/qrcode-form.vue'))
const leftSide = defineAsyncComponent(() => import('@/views/login/components/left-side.vue'))
const switchDark = defineAsyncComponent(() => import('@/layout/components/switch-dark/index.vue'))

// 当前激活的登录方式
type LoginType = 'password' | 'qrcode' | 'phone' | 'wechat' | 'qq' | 'dinging'

// 第三方登录
const activeLoginType = ref<LoginType>('password')

/**
 * 切换登录方式
 * @param type 登录方式
 */
const handleChangeLoginType = (type: LoginType) => {
  if (type === 'password' || type === 'phone' || type === 'qrcode') {
    activeLoginType.value = type
  } else {
    useMessage().error('暂不支持第三方登录')
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 左侧品牌介绍区域 -->
    <left-side />
    <!-- 右侧登录表单区域 -->
    <div class="login-right">
      <div class="login-form-container">
        <!-- 表单描述 -->
        <div class="mb-[1.25rem]">
          <div class="mb-8px text-24px color-#1f2329 font-600 dark-color-white">小糊涂・后台管理系统</div>
          <Transition mode="out-in" name="text-fade">
            <div :key="activeLoginType" class="m-0 text-14px color-#6b7280">
              {{
                activeLoginType === 'password' ? '密码验证 · 安全登录' : activeLoginType === 'phone' ? '手机验证 · 便捷登录' : '扫码授权 · 快捷登录'
              }}
            </div>
          </Transition>
        </div>
        <div class="form-container">
          <Transition mode="in-out" name="login-form-fade">
            <password-form v-if="activeLoginType === 'password'" key="password" />
          </Transition>
          <!-- 手机登录 -->
          <Transition mode="in-out" name="login-form-fade">
            <phone-form v-if="activeLoginType === 'phone'" key="phone" />
          </Transition>
          <!-- 扫码登录 -->
          <Transition mode="in-out" name="login-form-fade">
            <qrcode-form v-if="activeLoginType === 'qrcode'" key="qrcode" />
          </Transition>
        </div>
        <div class="divider">
          <span>其它登录方式</span>
        </div>
      </div>
      <!-- 其它登录方式  -->
      <div class="other-party-login">
        <div class="other-party-icons">
          <div
            :class="{ active: activeLoginType === 'password' }"
            class="other-party-icon-item"
            title="密码登录"
            @click="handleChangeLoginType('password')"
          >
            <div class="icon i-login-password" />
          </div>
          <div
            :class="{ active: activeLoginType === 'phone' }"
            class="other-party-icon-item"
            title="手机号登录"
            @click="handleChangeLoginType('phone')"
          >
            <div class="icon i-login-phone" />
          </div>
          <div
            :class="{ active: activeLoginType === 'qrcode' }"
            class="other-party-icon-item"
            title="扫码登录"
            @click="handleChangeLoginType('qrcode')"
          >
            <div class="icon i-login-sm" />
          </div>
          <div
            :class="{ active: activeLoginType === 'wechat' }"
            class="other-party-icon-item"
            title="微信登录"
            @click="handleChangeLoginType('wechat')"
          >
            <div class="icon i-login-wechat" />
          </div>
          <div :class="{ active: activeLoginType === 'qq' }" class="other-party-icon-item" title="QQ登录" @click="handleChangeLoginType('qq')">
            <div class="icon i-login-qq" />
          </div>
          <div
            :class="{ active: activeLoginType === 'dinging' }"
            class="other-party-icon-item"
            title="钉钉登录"
            @click="handleChangeLoginType('dinging')"
          >
            <div class="icon i-login-ding-ding" />
          </div>
        </div>
      </div>

      <div class="brand-footer">
        <span>Copyright © 2099-永久</span>
      </div>
      <div class="pos-absolute right-20px top-20px">
        <switch-dark />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container.dark {
  ---divider-bg-color: #636466;
  ---divider-text-color: #8d9095;
}

.login-container {
  user-select: none;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ---divider-bg-color: #cdd0d6;
  ---divider-text-color: #a8abb2;
}

// 右侧登录表单区域
.login-right {
  flex: 1;
  background: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .login-form-container {
    width: 100%;
    max-width: 300px;

    .divider {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(---divider-bg-color);
      }

      span {
        padding: 0 1rem;
        color: var(---divider-text-color);
        font-size: 0.8rem;
      }
    }
  }

  // 第三方登录样式
  .other-party-login {
    width: 100%;

    .other-party-icons {
      display: flex;
      justify-content: center;
      gap: 18px;
      flex-wrap: wrap;
      padding: 0 10px;

      .other-party-icon-item {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 50%;
        border: 2px solid transparent;
        position: relative;

        &:hover {
          background: #e8e8e8;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        &.active {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
          transform: scale(1.15);
          border-color: #3b82f6;

          .icon {
            width: 12px;
            height: 12px;
            color: #0f2044;
            fill: currentColor;
            filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));
            transform: scale(1.1);
          }
        }

        .icon {
          width: 24px;
          height: 24px;
          font-size: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
    }
  }

  .brand-footer {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    span {
      font-family: Arial, serif;
      font-size: 12px;
      letter-spacing: 1px;
      color: rgba(156, 163, 175, 0.89);
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-right {
    height: 100vh;
    width: 100%;

    .login-form-container {
      padding: 1.5rem;
      max-width: 360px;

      .form-header {
        margin-bottom: 1.5rem;

        .login-title {
          font-size: 1.6rem;
        }
      }

      .brand-footer {
        bottom: 1.5rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    flex-direction: column;
  }
  .login-right {
    height: 100vh;
    width: 100%;

    .login-form-container {
      padding: 1rem;
      max-width: 320px;

      .form-header {
        margin-bottom: 1.25rem;

        .login-title {
          font-size: 1.4rem;
        }
      }

      .brand-footer {
        bottom: 1rem;
      }
    }
  }
}

// 表单容器样式
.form-container {
  position: relative;
  height: 240px;
  overflow: hidden;

  // 确保表单在容器内正确定位
  > * {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>
