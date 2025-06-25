<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div class="lang-select layout-header-top-item">
      <svg-icon v-if="props.icon" name="language" :size="16" />
      <el-text v-if="!props.icon" class="user-select-none">{{ languageType }}</el-text>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :command="item.value"
          :disabled="item.value === themeStore.languageType"
          class="user-select-none"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useMessage } from '@/hooks/use-message'
import { useThemeStore } from '@/store/modules/theme.store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
defineOptions({ name: 'LangSelect' })

const themeStore = useThemeStore()

interface PropsType {
  icon?: boolean //icon Name
}

const props = withDefaults(defineProps<PropsType>(), {
  icon: false,
})
/**
 * 语言类型数组
 *
 */
const langOptions = [
  { label: '中文', value: 'zh-cn' },
  { label: 'English', value: 'en' },
]

const languageType = computed<string>(() =>
  themeStore.languageType === 'zh-cn' ? '简体中文' : 'English',
)
/**
 * 语言切换
 * @param lang 语言类型
 */
const handleLanguageChange = (lang: any) => {
  const loading = ElLoading.service({
    lock: true,
  })
  locale.value = lang
  themeStore.languageType = lang
  setTimeout(() => {
    if (lang == 'en') {
      useMessage().success('Language switch successful!')
    } else {
      useMessage().success('语言切换成功！')
    }
    loading.close()
  }, 500)
}
</script>
