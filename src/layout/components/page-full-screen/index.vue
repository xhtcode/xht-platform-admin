<template>
  <div @click="toggleFullScreen" class="page-full-screen layout-header-top-item">
    <div
      :class="isFullscreen ? 'icon-common-fullscreen-exit' : 'icon-common-fullscreen'"
      class="text-18px"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'PageFullScreen' })
const { toggle: toggleFullScreen, isFullscreen } = useFullscreen()
</script>
