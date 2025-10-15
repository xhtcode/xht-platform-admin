<template>
  <el-dropdown
    ref="dropdownRef"
    :virtual-ref="triggerRef"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom"
    @command="commandTrigger"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in menuList"
          :key="index"
          :command="item"
          :disabled="item.disabled"
          :divided="item.divided"
        >
          <div class="user-select-none flex-center">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import type { ContextMenuSchemaType, PropsTypes } from '@/components/context-menu/types'
import { ref, shallowRef, useTemplateRef } from 'vue'

defineOptions({ name: 'ContextMenu' })

// 获取dropdown组件的引用
const dropdownRef = useTemplateRef('dropdownRef')

// 定义事件发射器
const emits = defineEmits<{
  (e: 'change', type: OperationType | string, tagItem: any): void
}>()

// 定义组件props，默认值设置
const props = withDefaults(defineProps<PropsTypes>(), {
  trigger: 'contextmenu', // 触发方式，默认右键菜单
  disabled: false, // 是否禁用，默认不禁用
})

// 菜单位置状态
const position = ref<Partial<DOMRect>>({})

// 触发元素引用，用于定位菜单出现位置
const triggerRef = ref<any>({
  getBoundingClientRect: () => position.value,
})

// 菜单列表数据，通过v-model绑定
const menuList = defineModel<ContextMenuSchemaType[]>('menuList', {
  required: true,
  default: () => [],
})

// 当前操作项的数据
const itemData = shallowRef<any>()

// 菜单项点击处理函数
const commandTrigger = (menuItem: ContextMenuSchemaType) => {
  emits('change', menuItem.command as string, itemData.value)
}

// 打开右键菜单函数
const openContextmenu = (event: MouseEvent, tagItem?: any) => {
  // 保存当前操作项数据
  itemData.value = tagItem

  // 获取触发元素的位置信息
  const target = event.currentTarget as HTMLElement
  const { height, width, x, y } = target.getBoundingClientRect()

  // 设置菜单位置为元素底部中心
  position.value = DOMRect.fromRect({
    x: x + width / 2,
    y: y + height,
  })

  // 阻止默认右键菜单
  event.preventDefault()

  // 手动打开下拉菜单
  dropdownRef.value?.handleOpen()
}

// 暴露方法给父组件调用
defineExpose({
  openContextmenu,
})
</script>
