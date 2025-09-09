<template>
  <div class="switch-dark layout-header-top-item" @click="toggleColorScheme()">
    <div v-if="darkStatus" class="icon-common-moon text-16px" />
    <div v-else class="icon-common-sunny text-16px" />
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme.store'
import { isDark, toggleDark } from '@/utils/dark'

defineOptions({ name: 'SwitchDark' })

/**
 * 主题设置
 */
const themeStore = useThemeStore()
const darkStatus = computed(() => isDark.value)

function toggleColorScheme() {
  toggleDark()
  themeStore.darkStatus = isDark.value
  themeStore.mournModeStatus = false
  themeStore.colorWeaknessModeStatus = false
}
</script>
