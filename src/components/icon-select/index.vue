<template>
  <div class="icon-select-container w100">
    <el-input
      v-model="modelValue"
      :placeholder="placeholder"
      class="icon-select-input"
      readonly
      @click="openDialog"
    >
      <template #prepend>
        <svg-icon :name="modelValue" @click="openDialog()" />
      </template>
      <template v-if="clearable" #suffix>
        <el-icon class="button-hover" size="1em" @click="clearableValue">
          <circle-close />
        </el-icon>
      </template>
    </el-input>
    <el-dialog
      v-model="dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="true"
      :title="title"
      modal-class="icon-select-modal"
      align-center
      width="45%"
    >
      <el-input
        v-model="inputValue"
        autofocus
        clearable
        :placeholder="modelValue ? modelValue : '请输入要搜索图标的提示'"
        prefix-icon="Search"
        size="large"
      >
        <template #append>
          <svg-icon :name="modelValue" />
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
            <svg-icon :name="`${item.iconName}`" :size="18" />
          </li>
        </ul>
        <el-empty v-if="iconsList.length === 0" description="未搜索到您要找的图标~" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { CircleClose } from '@element-plus/icons-vue'

defineOptions({ name: 'SelectIcon' })

interface IconItemOptions {
  itemType: string
  iconName: any
}

interface PropsType {
  modelValue: string | null | undefined
  title?: string
  prepend?: string // 输入框前置内容
  placeholder?: string // 输入框占位文本
  size?: 'default' | 'large' | 'small' // 输入框大小
  disabled?: boolean // 禁用
  clearable?: boolean // 清空
}

const props = withDefaults(defineProps<PropsType>(), {
  placeholder: '请输入内容搜索图标或者选择图标', // 输入框占位文本
  title: '图标选择器',
  disabled: false, // 禁用
  clearable: false, // 禁用
})
const emit = defineEmits(['update:modelValue'])
const modelValue = useVModel(props, 'modelValue', emit)
const dialogVisible = ref(false)
const inputValue = ref<string | null | undefined>(modelValue.value)
const iconItems = ref<IconItemOptions[]>([])

const initSvg = () => {
  iconItems.value = []
  for (const icon in import.meta.glob('../../assets/icons/**/*.svg')) {
    const iconName = icon.split('assets/icons/')[1].split('.svg')[0].replace('/', '-')
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
  inputValue.value = ''
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
  if (!inputValue.value) return iconItems.value
  const result: IconItemOptions[] = []
  iconItems.value.forEach((item: IconItemOptions) => {
    if (item.iconName.toLowerCase().indexOf(inputValue.value!.toLowerCase()) > -1) {
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
