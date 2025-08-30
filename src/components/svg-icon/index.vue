<template>
  <svg class="svg-icon" :width="setIconImgOutStyle" :height="setIconImgOutStyle">
    <use :fill="color" :href="getSvgIconName" />
  </svg>
</template>
<script lang="ts" setup>
defineOptions({ name: 'SvgIcon' })

interface PropsType {
  name: any //icon Name
  color?: string //颜色
  size?: number //大小
}

const props = withDefaults(defineProps<PropsType>(), {
  prefix: 'icon',
  color: undefined,
  size: 14,
})
/**
 * 获取 icon 图标名称
 */
const getSvgIconName = computed<string>(() => `#icon-${props.name}`)
// 设置图片样式
const setIconImgOutStyle = computed(() => {
  return `${props.size}px`
})
</script>
<style scoped>
.svg-icon {
  user-select: none;
  display: inline-block;
  outline: none;
  fill: currentColor;
  overflow: hidden;
}
</style>
