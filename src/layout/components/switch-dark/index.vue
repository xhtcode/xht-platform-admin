<template>
  <div @click="toggleColorScheme()" class="switch-dark layout-header-top-item">
    <el-icon :size="20">
      <Moon v-if="darkStatus" />
      <Sunny v-else />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme.store'
import { isDark, toggleDark } from '@/utils/dark'
import { Moon, Sunny } from '@element-plus/icons-vue'

defineOptions({ name: 'SwitchDark' })

/**
 * 主题设置
 */
const themeStore = useThemeStore()
const darkStatus = computed(() => isDark.value)

function toggleColorScheme() {
  const service = ElLoading.service({
    lock: true,
    text: '正在切换主题',
    background: !isDark.value ? '#000000' : '#FFFFFF',
  })
  toggleDark()
  themeStore.darkStatus = isDark.value
  themeStore.mournModeStatus = false
  themeStore.colorWeaknessModeStatus = false
  window.setTimeout(() => {
    service.close()
  }, 1500)
}
</script>
