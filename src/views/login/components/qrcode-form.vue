<script lang="ts" setup>
import qrcodeUrl from '@/assets/images/qr-code.png'

/**
 * 扫码登录（界面占位）
 *
 * 说明：当前二维码为静态图片，未接入二维码生成、扫码状态轮询与确认流程，
 * 因此不提供真实登录能力。接入前提：后端提供二维码生成与状态轮询接口，
 * 前端在此处补充轮询、状态流转，以及登录成功后的 token 写入与跳转。
 */
defineOptions({ name: 'QrcodeForm' })
</script>

<template>
  <div class="qrcode-login text-center">
    <div class="qrcode-image">
      <el-image :src="qrcodeUrl" alt="扫码登录二维码" class="h-220px w-220px" fit="fill" />
    </div>
    <div class="text-[0.85rem] color-[var(--el-text-color-secondary)]">
      <p class="mb-5px">在手机上打开 “小糊涂App” 扫码</p>
      <p class="mb-0 text-12px color-[var(--el-text-color-placeholder)]">扫码登录暂未开放，请使用账号密码登录</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 扫码登录样式
.qrcode-login {
}
</style>
