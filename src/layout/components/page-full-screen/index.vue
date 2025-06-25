<template>
  <div @click="toggleFullScreen" class="page-full-screen layout-header-top-item">
    <svg-icon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"  :size="16"/>
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'PageFullScreen' })
const { toggle: toggleFullScreen, isFullscreen } = useFullscreen()
</script>
