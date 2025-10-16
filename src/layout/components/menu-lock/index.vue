<template>
  <div class="header-tool-item" @click="changeMenuStatus">
    <el-icon :size="20">
      <expand v-if="menuStatus" />
      <fold v-else />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { DeviceEnums } from '@/service/enums'

defineOptions({ name: 'MenuLock' })
const themeStore = useThemeStore()
const { menuStatus, device, sidebarStatus } = storeToRefs(themeStore)
/**
 * 切换菜单状态
 */
const changeMenuStatus = () => {
  if (device.value === DeviceEnums.MOBILE) {
    sidebarStatus.value = !sidebarStatus.value
  } else {
    menuStatus.value = !menuStatus.value
  }
}
</script>
