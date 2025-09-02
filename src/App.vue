<template>
  <el-config-provider :size="sizeType">
    <code-mirror-editor-components v-model="code" />
  </el-config-provider>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useThemeDeviceHooks } from '@/hooks/use-theme-hooks'
import CodeMirrorEditorComponents from '@/components/code-mirror-editor/index.vue'
import SwitchDark from '@/layout/components/switch-dark/index.vue'

const code = ref<string>(
  'package com.taiji.moudle.fishing.enums;\n' +
    '\n' +
    'import lombok.AllArgsConstructor;\n' +
    'import lombok.Getter;\n' +
    '\n' +
    '/**\n' +
    ' * @author\n' +
    ' **/\n' +
    '@Getter\n' +
    '@AllArgsConstructor\n' +
    'public enum FisheryCaptureExtendEnums {\n' +
    '    ZYSX(0, "作业时限"),\n' +
    '    //渔具名称及数量\n' +
    '    FISHINGGEAR_NAME_AND_AMOUNT(1, "渔具名称及数量"),\n' +
    '    MAIN_BREED_AND_QUOTA(2, "主捕品种及捕捞限额定义模型");\n' +
    '\n' +
    '    private final Integer value;\n' +
    '\n' +
    '    private final String desc;\n' +
    '}\n'
)
const themeStore = useThemeStore()
const { sizeType } = storeToRefs(themeStore)
useThemeDeviceHooks()
</script>
<style lang="scss" scoped></style>
