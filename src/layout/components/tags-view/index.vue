<template>
  <div class="xht-tags-container">
    <el-tabs @tab-change="handleChangeTag" @tab-remove="removeItem" v-model="activeName" class="xht-tags-item" type="card">
      <el-tab-pane
        v-for="item in visitedViews"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        style="display: none"
        :closable="!item.affixStatus"
      >
        <template #label>
          <i class="xht-tabs-icon" :class="`icon-menu-${item.icon}`" />
          {{ item.title }}
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="xht-tags-tool" @click="handleContextmenu($event)">
      <el-icon :size="22">
        <ArrowDownBold />
      </el-icon>
    </div>
    <tags-tool-menu ref="contextMenuRef" :disabled="loadingStatus" :menu-list="menuList" @change="commandTrigger" />
  </div>
</template>
<script lang="ts" setup>
import { filterAffixTagsView, formatRoute } from './helper'
import { useRouteStore } from '@/store/modules/routes.store'
import useTagsStore from '@/store/modules/tags.store'
import type { ContextMenuSchemaType } from '@/layout/components/tags-view/types'
import { useMessage } from '@/hooks/use-message'
import type { TabPaneName } from 'element-plus'
import useRouterLoadingHooks from '@/hooks/use-router-loading'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'TagsView' })
const tagsToolMenu = defineAsyncComponent(() => import('@/layout/components/tags-view/components/tags-tool-menu.vue'))

// 路由相关实例
const router = useRouter()
const route = useRoute()

// 状态管理实例
const routeStore = useRouteStore()
const tagsViewPlusStore = useTagsStore()
const { activeName } = storeToRefs(tagsViewPlusStore)
// 模板引用
const contextMenuRef = useTemplateRef('contextMenuRef')

// 响应式数据
const affixTagArr = ref<TagsViewType[]>([]) // 固定标签数组
const visitedViews = computed(() => tagsViewPlusStore.visitedViews) // 已访问视图列表
const menuList = shallowRef<ContextMenuSchemaType[]>([]) // 右键菜单列表
const activeTab = computed<TagsViewType | undefined>(() => {
  return tagsViewPlusStore.visitedViews.find((item) => item.path === unref(router.currentRoute).fullPath)
})
const { loadingStatus, refreshRouter } = useRouterLoadingHooks()
/**
 * 处理右键菜单命令触发事件
 * @param command 命令类型
 */
const commandTrigger = (command: string) => {
  if (!activeTab.value) return
  switch (command) {
    case 'refresh':
      refreshSelectedTag()
      break
    case 'close':
      closeSelectedTag()
      break
    case 'closeLeft':
      tagsViewPlusStore.removeLeftVisitedViews(activeTab.value)
      break
    case 'closeRight':
      tagsViewPlusStore.removeRightVisitedViews(activeTab.value)
      break
    case 'closeOther':
      tagsViewPlusStore.removeOtherVisitedViews(activeTab.value)
      break
    case 'closeAll':
      tagsViewPlusStore.removeAllVisitedViews()
      toLastView()
      break
  }
}

/**
 * 处理标签右键菜单事件
 * @param event 鼠标事件
 */
const handleContextmenu = (event: MouseEvent) => {
  if (loadingStatus.value) {
    return
  }
  menuList.value = [
    {
      icon: 'refresh',
      label: '重新加载',
      disabled: false,
      command: 'refresh',
    },
    {
      icon: 'close',
      label: '关闭此项',
      command: 'close',
    },
    {
      divided: true,
      icon: 'd-arrow-left',
      label: '关闭左侧',
      command: 'closeLeft',
    },
    {
      icon: 'd-arrow-right',
      label: '关闭右侧',
      command: 'closeRight',
    },
    {
      divided: true,
      icon: 'discount',
      label: '关闭其他',
      disabled: false,
      command: 'closeOther',
    },
  ]
  contextMenuRef.value?.openContextmenu(event)
}

/**
 * 初始化固定标签
 */
const initTags = () => {
  affixTagArr.value = filterAffixTagsView(routeStore.allRoutes)
  for (const tag of unref(affixTagArr)) {
    if (tag.name) {
      tagsViewPlusStore.addVisitedViews(tag)
    }
  }
}

/**
 * 添加新的标签页
 */
const addTags = () => {
  const currentRoute = unref(router.currentRoute)
  if (currentRoute.name && !currentRoute.meta?.linkStatus) {
    tagsViewPlusStore.addVisitedViews(formatRoute(router.currentRoute.value))
    activeName.value = currentRoute.fullPath
  }
}
/**
 * 删除标签页
 * @param key 标签页key
 */
const removeItem = (key: TabPaneName) => {
  tagsViewPlusStore.visitedViews.forEach((item, index) => {
    if (item.path === key) {
      const nextTab = tagsViewPlusStore.visitedViews[index + 1] || tagsViewPlusStore.visitedViews[index - 1]
      tagsViewPlusStore.removeVisitedView(item)
      if (activeName.value === key && nextTab) {
        router.push(nextTab.path)
      }
      return
    }
  })
}
/**
 * 关闭指定标签页
 */
const closeSelectedTag = () => {
  // 固定标签不允许关闭
  if (activeTab.value?.affixStatus) return
  tagsViewPlusStore.removeVisitedView(activeTab.value!)
  toLastView()
}
const emits = defineEmits(['refresh'])
/**
 * 刷新当前选中的标签页
 */
const refreshSelectedTag = async () => {
  await refreshRouter()
}

/**
 * 跳转到最后一个访问的视图
 */
const toLastView = () => {
  const visitedViews = tagsViewPlusStore.visitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push({ path: latestView.path })
  } else {
    router.replace({ path: '/redirect/home' })
  }
}

/**
 * 处理标签点击事件
 */
const handleChangeTag = (item: TabPaneName) => {
  router.push(item as string).catch((_) => {
    useMessage().error('路由错误，请联系管理员!')
  })
}

/**
 * 组件挂载后初始化标签和位置
 */
onMounted(() => {
  initTags()
})

/**
 * 监听路由变化，自动添加标签
 */
watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      addTags()
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss">
@use '@/styles/variables' as va;

.xht-tags-container {
  $tags-tool-width: 50px;
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--xht-border-color);

  .xht-tags-item {
    width: calc(100% - $tags-tool-width);
  }

  .el-tabs__header {
    padding: 0 0 0 0;
    height: va.$tags-height;
    box-sizing: border-box;
    margin: 0;
    border: none;
  }

  .el-tabs__nav {
    border-radius: 4px 4px 0 0;
    display: flex;
    border: none !important;
  }

  .is-scrollable {
    padding: 0 $tags-tool-width;

    .base-nav_btn {
      width: $tags-tool-width;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-weight: bold;
      font-size: 24px;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .el-tabs__nav-prev {
      @extend .base-nav_btn;
      border-right: 1px solid var(--xht-border-color);
    }

    .el-tabs__nav-next {
      @extend .base-nav_btn;
      border-left: 1px solid var(--xht-border-color);
    }
  }

  .el-tabs__item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #afafaf;
    border: none !important;
    user-select: none;

    .el-icon {
      width: 14px !important;
    }

    &:hover {
      color: var(--el-color-primary);

      &::before {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0;
        content: '';
        border-bottom: 2px solid var(--el-color-primary) !important;
      }
    }
  }

  .is-active {
    color: var(--el-color-primary);

    &::before {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 0;
      content: '';
      border-bottom: 2px solid var(--el-color-primary) !important;
    }
  }

  .xht-tabs-icon {
    width: 14px;
    height: 14px;
    font-size: 12px;
    position: relative;
    left: -7px;
  }

  .is-closable {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .xht-tags-tool {
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    width: $tags-tool-width;
    height: va.$tags-height;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid var(--xht-border-color);

    &:hover {
      background-color: var(--xht-hover-bg-color);
    }
  }
}
</style>
