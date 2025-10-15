<template>
  <div class="layout-container-logo">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <div :key="+menuCollapse" class="wh-100 flex-center">
        <img alt="logo" class="layout-logo-img" src="@/assets/images/vue.svg" />
        <div v-if="menuCollapse" class="layout-logo-text">小糊涂后台管理</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useThemeHooks } from '@/hooks/use-theme-hooks'

defineOptions({ name: 'LogoImage' })
const { menuCollapse } = useThemeHooks()
</script>

<style lang="scss" scoped>
.layout-container-logo {
  display: flex;
  height: $header-height;
  user-select: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .layout-logo-img {
    height: 18px;
    object-fit: contain;
    margin-right: 6px;
  }

  .layout-logo-text {
    font-family:
      Avenir,
      Helvetica Neue,
      Arial,
      Helvetica,
      sans-serif;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
  }
}
</style>
