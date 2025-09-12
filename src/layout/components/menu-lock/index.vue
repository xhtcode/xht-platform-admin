<template>
  <div class="collapse-icon flex-center" @click="changeMenuStatus">
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

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.collapse-icon {
  padding: 0 10px;
  height: $header-height;
  line-height: $header-height;
  cursor: pointer;
  width: 40px;
  justify-content: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    color: var(--el-color-primary);
    background-color: rgba(0, 0, 0, 0.06);
  }
}
</style>
