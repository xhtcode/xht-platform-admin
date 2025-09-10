<template>
  <div class="icon-select-container w100">
    <el-input
      v-model="modelValue"
      :placeholder="props.placeholder"
      class="icon-select-input"
      readonly
      @click="openDialog"
    >
      <template #prepend>
        <div :class="`icon-menu-${modelValue}`" @click="openDialog()" />
      </template>
      <template v-if="props.clearable" #suffix>
        <el-icon class="button-hover" size="1em" @click="clearableValue">
          <circle-close />
        </el-icon>
      </template>
    </el-input>
    <el-dialog
      v-model="dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="true"
      :title="props.title"
      modal-class="icon-select-modal"
      align-center
      width="45%"
    >
      <el-input
        v-model="modelValue"
        autofocus
        clearable
        :placeholder="modelValue ? modelValue : '请输入要搜索图标的提示'"
        prefix-icon="Search"
        size="large"
      >
        <template #append>
          <div :class="`icon-menu-${modelValue}`" />
        </template>
      </el-input>
      <el-scrollbar height="270px">
        <ul class="icon-container">
          <li
            v-for="(item, index) in iconsList"
            :key="index"
            class="icon-item"
            :class="[{ 'is-active': item.iconName === modelValue }]"
            @click="selectIcon(item, false)"
            @dblclick="selectIcon(item, true)"
          >
            <div :class="`icon-menu-${item.iconName}`" />
          </li>
        </ul>
        <el-empty v-if="iconsList.length === 0" description="未搜索到您要找的图标~" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import type { IconItemOptions, IconSelectProps } from '@/components/icon-select/types'

defineOptions({ name: 'SelectIcon', inheritAttrs: false })

const props = withDefaults(defineProps<IconSelectProps>(), {
  placeholder: '请输入内容搜索图标或者选择图标', // 输入框占位文本
  title: '图标选择器',
  clearable: false, // 禁用
})
const modelValue = defineModel<string>('modelValue')
const dialogVisible = ref<boolean>(false)
const iconItems = ref<IconItemOptions[]>([])
const initSvg = () => {
  iconItems.value = []
  for (const icon in import.meta.glob('../../assets/icons/menu/*.svg')) {
    const iconName = icon.split('assets/icons/menu/')[1].split('.svg')[0].replace('/', '-')
    iconItems.value?.push({ itemType: 'svg', iconName: iconName })
  }
}

/**
 * 打开
 */
const openDialog = () => {
  handleChangeIconItem()
  dialogVisible.value = true
}
/**
 * 清空
 */
const clearableValue = () => {
  modelValue.value = ''
}
/**
 * 关闭
 */
const closeDialog = () => {
  dialogVisible.value = false
}
/**
 * 选中图标
 * @param item
 * @param collapse
 */
const selectIcon = (item: IconItemOptions, collapse: boolean) => {
  modelValue.value = item.iconName
  if (collapse) {
    closeDialog()
  }
}
/**
 * 初始化图标 并且根据搜索值计算图标有多少
 */
const iconsList = computed<IconItemOptions[]>(() => {
  if (!modelValue.value) return iconItems.value
  const result: IconItemOptions[] = []
  iconItems.value.forEach((item: IconItemOptions) => {
    if (item.iconName.toLowerCase().indexOf(modelValue.value!.toLowerCase()) > -1) {
      result.push({ ...item })
    }
  })
  return result
})

/**
 * 图标类型切换
 */
const handleChangeIconItem = () => {
  initSvg()
}

onMounted(() => {
  initSvg()
})
</script>
<style lang="scss" scoped>
.icon-selector-popover {
  width: 90% !important;
  overflow: hidden;
}

.icon-container {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    margin: 4px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: var(--xht-border-radius-base);
    transition: all 0.3s;
  }

  .icon-item:hover {
    border-color: #409eff;
    scale: 1.2;
  }
}

.icon-select-container {
  .icon-select-input {
    .el-input__inner {
      cursor: pointer !important;
      user-select: none;
    }
  }

  .icon-select-modal {
    padding: 25px 20px 20px;

    .icon-list-container {
      display: flex;
      flex-wrap: wrap;
      height: 50vh;

      .icon-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        margin: 4px;
        border: 1px solid #dcdfe6;
        border-radius: var(--xht-border-radius-base);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: var(--el-color-primary);
          scale: 1.1;
        }
      }
    }

    .is-active {
      border-color: var(--el-color-primary);
      background: var(--xht-button-hover-bg-color);
      scale: 1.1;
    }
  }
}
</style>
