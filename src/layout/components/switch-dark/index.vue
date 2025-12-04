<template>
  <div class="header-tool-item" @click="toggleColorScheme()">
    <div v-if="darkStatus" class="i-common-moon size-20px" />
    <div v-else class="i-common-sunny size-20px" />
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
