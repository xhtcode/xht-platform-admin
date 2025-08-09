<template>
  <el-dropdown trigger="click" @command="handleSizeChange">
    <div class="size-select layout-header-top-item">
      <svg-icon name="size" :size="16" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions"
          :key="item.value"
          :command="item"
          :disabled="item.value === themeStore.sizeType"
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

defineOptions({ name: 'SizeSelect' })

const themeStore = useThemeStore()
const { t } = useI18n()
/**
 * 尺寸大小类型
 */
const langOptions = [
  { label: '大型', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小型', value: 'small' },
]

/**
 * 尺寸切换
 * @param type 尺寸大小类型
 */
const handleSizeChange = (type: CommonKeyValue<string, any>) => {
  useMessage().success(t('theme.changeSizeType'))
  themeStore.sizeType = type.value
}
</script>
