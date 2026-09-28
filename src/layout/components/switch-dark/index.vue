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

<template>
  <div class="header-tool-item" @click="toggleColorScheme()">
    <div v-if="darkStatus" class="i-common-moon h-18px w-18px" />
    <div v-else class="i-common-sunny h-18px w-18px" />
  </div>
</template>
