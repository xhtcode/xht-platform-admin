<template>
  <div class="context-menu-container">
    <!-- 可自定义内容区域 -->
    <div class="target-area" @contextmenu.prevent="showMenu" @click="hideMenu" :style="targetStyle">
      <slot>右键点击此区域打开菜单</slot>
    </div>

    <!-- 右键菜单 -->
    <transition-group name="context-menu">
      <ul
        v-if="isVisible"
        ref="contextMenu"
        class="context-menu"
        :style="{ left: `${x}px`, top: `${y}px` }"
        @click.stop
        @keydown.esc="hideMenu"
        @keydown.tab.prevent="handleTabNavigation"
        tabindex="-1"
      >
        <template v-for="(item, index) in items" :key="item.key || index">
          <!-- 分隔线 -->
          <li v-if="item.type === 'separator'" class="separator" role="separator" />

          <!-- 菜单项 -->
          <li
            v-else
            class="menu-item"
            :class="{
              disabled: item.disabled,
              active: activeIndex === index && !item.disabled,
            }"
            @click="handleSelect(item)"
            @mouseenter="setActiveIndex(index)"
            :role="!item.disabled ? 'menuitem' : undefined"
            :tabindex="!item.disabled ? 0 : -1"
          >
            <!-- 支持图标 -->
            <span v-if="item.icon" class="icon">
              <svg-icon :name="item.icon" />
            </span>
            <span class="label">{{ item.label }}</span>
          </li>
        </template>
      </ul>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

defineOptions({ name: 'ContextMenu' })

// 定义菜单项类型
interface MenuItem {
  key: string | number // 用于v-for的key，提高性能
  label?: string // 菜单项文本
  icon?: string // 图标类名
  action?: string // 动作标识
  disabled?: boolean // 是否禁用
  type?: 'item' | 'separator' // 项目类型
  [key: string]: any // 允许自定义属性
}

// 组件Props
const props = defineProps<{
  items?: MenuItem[]
  targetStyle?: Record<string, string>
  closeOnSelect?: boolean
  darkMode?: boolean // 新增：是否启用深色模式
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'select', item: MenuItem): void
  (e: 'show'): void
  (e: 'hide'): void
}>()

// 默认菜单项
const defaultItems: MenuItem[] = [
  { key: 'copy', label: '复制', action: 'copy', icon: 'fas fa-copy' },
  { key: 'paste', label: '粘贴', action: 'paste', icon: 'fas fa-paste' },
  { key: 'sep1', type: 'separator' },
  { key: 'delete', label: '删除', action: 'delete', icon: 'fas fa-trash' },
  { key: 'properties', label: '属性', action: 'properties', icon: 'fas fa-cog' },
]

// 计算属性 - 合并默认菜单项和自定义菜单项
const items = computed<MenuItem[]>(() => {
  return props.items || defaultItems
})

// 过滤出可用的菜单项（非分隔线且未禁用）
const validItems = computed<MenuItem[]>(() => {
  return items.value.filter((item) => item.type !== 'separator' && !item.disabled)
})

// 菜单状态和位置
const isVisible = ref(false)
const x = ref(0)
const y = ref(0)
const contextMenu = ref<HTMLUListElement>()
const activeIndex = ref(-1)
const initialClientX = ref(0)
const initialClientY = ref(0)

// 显示菜单
const showMenu = (e: MouseEvent) => {
  // 记录初始位置，用于后续计算
  initialClientX.value = e.clientX
  initialClientY.value = e.clientY

  isVisible.value = true
  emit('show')

  // 重置激活状态
  activeIndex.value = -1

  // 菜单渲染后计算位置并获取焦点
  nextTick(() => {
    calculateMenuPosition()
    contextMenu.value?.focus()
  })
}

// 隐藏菜单
const hideMenu = () => {
  if (isVisible.value) {
    isVisible.value = false
    emit('hide')
    activeIndex.value = -1
  }
}

// 计算菜单位置，确保不会超出视口
const calculateMenuPosition = () => {
  if (!contextMenu.value) return

  const menuRect = contextMenu.value.getBoundingClientRect()
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 计算X坐标，防止右侧超出
  x.value =
    initialClientX.value + menuRect.width > windowWidth
      ? Math.max(0, windowWidth - menuRect.width - 10)
      : initialClientX.value + 5

  // 计算Y坐标，防止底部超出
  y.value =
    initialClientY.value + menuRect.height > windowHeight
      ? Math.max(0, windowHeight - menuRect.height - 10)
      : initialClientY.value + 5
}

// 处理菜单项选择
const handleSelect = (item: MenuItem) => {
  if (item.disabled) return
  emit('select', item)
  // 根据配置决定是否在选择后关闭菜单
  hideMenu()
}

// 设置激活的菜单项索引
const setActiveIndex = (index: number) => {
  if (!items.value[index].disabled && items.value[index].type !== 'separator') {
    activeIndex.value = index
  }
}

// 点击外部关闭菜单
const handleOutsideClick = (e: MouseEvent) => {
  if (contextMenu.value && !contextMenu.value.contains(e.target as Node)) {
    hideMenu()
  }
}

// 处理Tab键导航
const handleTabNavigation = (e: KeyboardEvent) => {
  const direction = e.shiftKey ? -1 : 1
  handleArrowNavigation(direction)
}

// 处理箭头导航
const handleArrowNavigation = (direction: number) => {
  if (validItems.value.length === 0) return

  // 找到当前激活项在有效项中的索引
  const currentValidIndex = validItems.value.findIndex((_, i) => {
    return items.value.findIndex((item) => item === validItems.value[i]) === activeIndex.value
  })

  // 计算新索引
  let newValidIndex
  if (currentValidIndex === -1) {
    newValidIndex = direction > 0 ? 0 : validItems.value.length - 1
  } else {
    newValidIndex =
      (currentValidIndex + direction + validItems.value.length) % validItems.value.length
  }

  // 找到新索引在原始数组中的位置
  const newIndex = items.value.findIndex((item) => item === validItems.value[newValidIndex])
  if (newIndex !== -1) {
    activeIndex.value = newIndex
    scrollToActiveItem()
  }
}

// 滚动到当前激活的菜单项
const scrollToActiveItem = () => {
  if (!contextMenu.value || activeIndex.value === -1) return
  const items = contextMenu.value.querySelectorAll('.menu-item:not(.disabled)')
  const activeItem = items[activeIndex.value] as HTMLElement

  if (activeItem) {
    activeItem.scrollIntoView({ block: 'nearest' })
    activeItem.focus()
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style lang="scss" scoped>
.context-menu-container {
  position: relative;
}

.target-area {
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.target-area:hover {
  border-color: #cbd5e1;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  outline: none;
  transition: background-color 0.2s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #1e293b;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.menu-item .icon {
  margin-right: 8px;
  width: 16px;
  text-align: center;
}

.menu-item.active,
.menu-item:not(.disabled):hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.menu-item.disabled {
  color: #94a3b8;
  cursor: default;
}

.separator {
  height: 1px;
  margin: 4px 0;
  background-color: #e2e8f0;
}

/* 过渡动画 */
.context-menu-enter-active,
.context-menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.context-menu-enter-to,
.context-menu-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* 焦点状态可见性，提高可访问性 */
.menu-item:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}
</style>
