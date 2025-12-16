<script lang="ts" setup>
import qrcodeUrl from '@/assets/images/qr-code.png'
</script>

<template>
  <div class="qrcode-login text-center">
    <div class="qrcode-image">
      <el-image :src="qrcodeUrl" alt="扫码登录二维码" class="h-220px w-220px" fit="fill" />
    </div>
    <div class="text-[0.85rem] color-#6b7280">
      <p class="mb-5px">在手机上打开 “小糊涂App” 扫码</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 扫码登录样式
.qrcode-login {
}
</style>
