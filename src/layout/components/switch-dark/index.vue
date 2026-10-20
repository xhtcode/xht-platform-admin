<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme.store'
import { isDark, toggleDark } from '@/utils/dark'
import { useThemeTransition } from '@/hooks/use-theme-transition'

defineOptions({ name: 'SwitchDark' })

/**
 * 主题设置
 */
const themeStore = useThemeStore()
const darkStatus = computed(() => isDark.value)
const { withThemeTransition } = useThemeTransition()

/**
 * 切换明亮 / 暗黑模式
 * 以按钮中心为圆心执行圆形扩散过渡，不支持 View Transitions 时降级为直接切换
 */
function toggleColorScheme(event: MouseEvent) {
  withThemeTransition(event, () => {
    toggleDark()
    themeStore.darkStatus = isDark.value
    themeStore.mournModeStatus = false
    themeStore.colorWeaknessModeStatus = false
  })
}
</script>

<template>
  <div class="header-tool-item" @click="toggleColorScheme">
    <div v-if="darkStatus" class="i-common-moon h-18px w-18px" />
    <div v-else class="i-common-sunny h-18px w-18px" />
  </div>
</template>
