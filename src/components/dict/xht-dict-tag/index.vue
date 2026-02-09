<script setup lang="ts">
import type { XhtDictTagEmits, XhtDictTagProps } from '@/components/dict/xht-dict-tag/types'
import { useDictHooks } from '@/hooks/use-dict'
import { DictVo } from '@/store/modules/dict.store'

defineOptions({
  name: 'XhtDictTag',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<XhtDictTagProps>(), {
  hit: false, // 是否有边框描边
  effect: 'dark', // Tag 的主题
  alignment: 'center', // 对齐的方式
  direction: 'horizontal', // 排列的方向
  wrap: false, // 设置是否自动折行
  fill: false, //	子元素是否填充父容器
  fillRatio: 100, //	填充父容器的比例
})

const emits = defineEmits<XhtDictTagEmits>()

/**
 * 字典数据
 */
const { loadingStatus, dictData } = useDictHooks(props.dictCode)

/**
 * 计算过滤后的字典数据
 */
const filterDictData = computed(() => {
  if (!props.filterLabel) {
    return dictData.value
  }
  return dictData.value.filter((item) => {
    if (Array.isArray(props.filterLabel)) {
      return props.filterLabel.includes(item.value)
    } else {
      return item.value === props.filterLabel
    }
  })
})

const handlerClick = (item: DictVo) => {
  emits('tag-click', item)
}
</script>

<template>
  <el-space
    class="user-select-none"
    v-loading="loadingStatus"
    :alignment="alignment"
    :class="className"
    :direction="direction"
    :size="spaceSize"
    :wrap="wrap"
    :fill="fill"
    :fill-ratio="fillRatio"
  >
    <el-tag
      class="dict-status-tag"
      v-for="item in filterDictData"
      :key="item.value"
      :hit="hit"
      :size="size"
      :effect="effect"
      :round="round"
      :color="item.color"
      @click="handlerClick(item)"
    >
      {{ item.label }}
    </el-tag>
  </el-space>
</template>

<style scoped lang="scss">
.dict-status-tag {
  border-width: 0 !important;
  color: #ffffff;
  user-select: none;
}
</style>
