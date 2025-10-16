<template>
  <div class="header-tool-item" @click="toggleFullScreen">
    <div
      :class="isFullscreen ? 'icon-common-fullscreen-exit' : 'icon-common-fullscreen'"
      class="size-20px"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'PageFullScreen' })
const { toggle: toggleFullScreen, isFullscreen } = useFullscreen()
</script>
