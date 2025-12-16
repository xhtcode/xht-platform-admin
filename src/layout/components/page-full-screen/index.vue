<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'PageFullScreen' })
const { toggle: toggleFullScreen, isFullscreen } = useFullscreen()
</script>

<template>
  <div class="header-tool-item" @click="toggleFullScreen">
    <div :class="isFullscreen ? 'i-common-fullscreen-exit' : 'i-common-fullscreen'" class="size-20px" />
  </div>
</template>
