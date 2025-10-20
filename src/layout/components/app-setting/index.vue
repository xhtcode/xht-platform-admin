<template>
  <div class="header-tool-item" @click="state.visibleStatus = true">
    <div class="icon-common-theme size-20px" />
    <el-drawer
      v-model="state.visibleStatus"
      :close-on-click-modal="false"
      append-to-body
      size="360px"
      title="主题设置"
    >
      <el-form
        ref="queryFormRef"
        :disabled="state.loadingStatus"
        class="user-select-display app-setting-form"
        label-width="80px"
        size="default"
      >
        <el-divider>布局样式</el-divider>
        <el-form-item label="水印内容">
          <el-input v-model="watermarkContent" disabled placeholder="请输入水印内容" />
        </el-form-item>
        <el-divider>主题设置</el-divider>
        <el-form-item label="主题颜色">
          <el-color-picker
            v-model="colorType"
            popper-class="custom-color-picker"
            :predefine="predefineColors"
            color-format="rgb"
            :disabled="displayColorPicker"
            @change="changeThemeColor"
          />
        </el-form-item>
        <el-form-item label="哀悼模式">
          <el-switch
            v-model="mournModeStatus"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="true"
            :disabled="themeStore.darkStatus"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="色弱模式">
          <el-switch
            v-model="colorWeaknessModeStatus"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="true"
            :disabled="themeStore.darkStatus"
            :inactive-value="false"
          />
        </el-form-item>
        <el-divider>界面设置</el-divider>
        <el-form-item label="组件大小">
          <el-radio-group v-model="sizeType">
            <el-radio-button :value="ComponentSizeEnums.LARGE" label="大型" />
            <el-radio-button :value="ComponentSizeEnums.DEFAULT" label="默认" />
            <el-radio-button :value="ComponentSizeEnums.SMALL" label="小型" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面包屑">
          <el-switch
            v-model="breadcrumb"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="标签页">
          <el-switch
            v-model="tagsViewStatus"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="底部版权">
          <el-switch
            v-model="footerStatus"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" size="default" @click="resetSetting">恢复默认</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store'
import { AppLanguageEnums, ComponentSizeEnums } from '@/service/enums'
import { storeToRefs } from 'pinia'
import useThemeColorHooks from '@/hooks/use-theme-hooks'
import { DefaultThemeColor } from '@/service/constant'

defineOptions({
  name: 'AppSetting',
})

interface StateType {
  visibleStatus: boolean
  loadingStatus: boolean
}

const state = reactive<StateType>({
  visibleStatus: false,
  loadingStatus: false,
})
const themeStore = useThemeStore()
const {
  darkStatus,
  breadcrumb,
  tagsViewStatus,
  footerStatus,
  watermarkContent,
  languageType,
  sizeType,
  colorType,
  mournModeStatus,
  colorWeaknessModeStatus,
} = storeToRefs(themeStore)
const { changeThemeColor } = useThemeColorHooks()
const queryFormRef = useTemplateRef('queryFormRef')
const predefineColors = ref([
  '#409EFF',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#c71585',
])
/**
 * 禁用 颜色选择器
 */
const displayColorPicker = computed(() => mournModeStatus.value || colorWeaknessModeStatus.value)
/**
 * 恢复默认配置
 */
const resetSetting = () => {
  darkStatus.value = false
  breadcrumb.value = true
  tagsViewStatus.value = true
  footerStatus.value = true
  languageType.value = AppLanguageEnums.EN
  sizeType.value = ComponentSizeEnums.DEFAULT
  colorType.value = DefaultThemeColor
  mournModeStatus.value = false
  colorWeaknessModeStatus.value = false
}
</script>
