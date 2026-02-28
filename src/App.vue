<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'
import { ButtonConfigContext } from 'element-plus/es/components/button/src/button'
import { LinkConfigContext } from 'element-plus/es/components/link/src/link'
import { DialogConfigContext } from 'element-plus'
import type { MessageConfigContext } from 'element-plus/es/components/message'

const themeStore = useThemeStore()
const { sizeType } = storeToRefs(themeStore)
useThemeDeviceHooks()

const buttonConfig: ButtonConfigContext = {
  autoInsertSpace: true,
}
const linkConfig: LinkConfigContext = {
  underline: 'hover',
}
const dialogConfig: DialogConfigContext = {}
const messageConfig: MessageConfigContext = {
  max: 5,
  duration: 5000,
}
</script>

<template>
  <el-config-provider
    :locale="zhCn"
    :size="sizeType"
    :button="buttonConfig"
    :link="linkConfig"
    :dialog="dialogConfig"
    :message="messageConfig"
    :experimental-features="{}"
    :value-on-clear="null"
    :empty-values="[undefined, null]"
  >
    <router-view />
  </el-config-provider>
</template>

<style lang="scss" scoped></style>
