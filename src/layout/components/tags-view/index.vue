<template>
  <div class="header-container-tags">
    <div class="tags-container">
      <span
        class="tags-container-view-tool tags-container-view-tool-first"
        style="border-left: none"
        @click="move(-100)"
      >
        <el-icon class="tags-view-tool-icon-hover">
          <d-arrow-left />
        </el-icon>
      </span>
      <div class="tags-container-view-tool flex-1">
        <el-scrollbar
          ref="scrollbarRef"
          class="h-full"
          view-class="h-full"
          @scroll="elScrollbarScroll"
        >
          <div class="h-full flex items-center">
            <template v-for="item in visitedViews" :key="item.path">
              <div
                :class="[
                  `tags-view-item`,
                  {
                    'is-active': isActive(item),
                  },
                ]"
                :ref="tagLinksRefs.set"
                @contextmenu="handleContextmenu($event, item)"
                @click="handleClickMenu(item)"
              >
                <div :class="`icon-menu-${item.icon}`" />
                <div class="pl-5px flex-1 text-nowrap">{{ item.title }}</div>
                <el-icon
                  v-if="!item.affixStatus"
                  :size="14"
                  class="tags-view-item-close"
                  @click.prevent.stop="closeSelectedTag(item)"
                >
                  <close />
                </el-icon>
              </div>
            </template>
            <context-menu ref="contextMenuRef" :menu-list="menuList" @change="commandTrigger" />
          </div>
        </el-scrollbar>
      </div>
      <span class="tags-container-view-tool" @click="move(100)">
        <el-icon class="tags-view-tool-icon-hover">
          <d-arrow-right />
        </el-icon>
      </span>
      <el-dropdown trigger="click">
        <span class="tags-container-view-tool flex-center">
          <el-icon class="tags-view-tool-icon-hover">
            <Grid />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="user-select-none flex-center" @click="refreshSelectedTag(selectedTag)">
                <el-icon>
                  <refresh-right />
                </el-icon>
                <span>重新加载</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="user-select-none flex-center" @click="commandTrigger('closeAll', null)">
                <el-icon>
                  <minus />
                </el-icon>
                <span>全部关闭</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { filterAffixTagsView, formatRoute } from './helper'
import { useTemplateRefsList } from '@vueuse/core'
import { useRouteStore } from '@/store/modules/routes.store'
import { Close, DArrowLeft, DArrowRight, Grid, Minus, RefreshRight } from '@element-plus/icons-vue'
import useTagsStore from '@/store/modules/tags.store'
import { useMessage } from '@/hooks/use-message'
import type { ContextMenuSchemaType } from '@/components/context-menu/types'

// 定义组件名称
defineOptions({ name: 'TagsViewComponent' })

// 路由相关实例
const router = useRouter()
const route = useRoute()

// 状态管理实例
const routeStore = useRouteStore()
const tagsViewPlusStore = useTagsStore()

// 模板引用
const contextMenuRef = useTemplateRef('contextMenuRef')
const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()
const scrollbarRef = useTemplateRef<any>('scrollbarRef')

// 响应式数据
const affixTagArr = ref<TagsViewType[]>([]) // 固定标签数组
const visitedViews = computed(() => tagsViewPlusStore.visitedViews) // 已访问视图列表
const scrollLeftNumber = useStorage<number>('scrollLeftNumber', 0) // 滚动位置存储
const selectedTag = ref<RouteLocationNormalizedLoaded>() // 当前选中的标签
const menuList = shallowRef<ContextMenuSchemaType[]>([]) // 右键菜单列表

/**
 * 处理右键菜单命令触发事件
 * @param command 命令类型
 * @param tagItem 标签项
 */
const commandTrigger = (command: string, tagItem: any) => {
  switch (command) {
    case 'refresh':
      refreshSelectedTag(selectedTag.value)
      break
    case 'close':
      closeSelectedTag(tagItem)
      break
    case 'closeLeft':
      tagsViewPlusStore.removeLeftVisitedViews(tagItem)
      break
    case 'closeRight':
      tagsViewPlusStore.removeRightVisitedViews(tagItem)
      break
    case 'closeOther':
      tagsViewPlusStore.removeOtherVisitedViews(tagItem)
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
 * @param tagItem 标签项
 */
const handleContextmenu = (event: MouseEvent, tagItem: TagsViewType) => {
  menuList.value = [
    {
      icon: 'refresh',
      label: '重新加载',
      disabled: selectedTag.value?.fullPath !== tagItem.path,
      command: 'refresh',
    },
    {
      icon: 'close',
      label: '关闭此项',
      disabled: !!visitedViews.value?.length && selectedTag.value?.meta.affixStatus,
      command: 'close',
    },
    {
      divided: true,
      icon: 'd-arrow-left',
      label: '关闭左侧',
      disabled:
        !!visitedViews.value?.length &&
        (tagItem.path === visitedViews.value![0].path ||
          selectedTag.value?.fullPath !== tagItem.path),
      command: 'closeLeft',
    },
    {
      icon: 'd-arrow-right',
      label: '关闭右侧',
      disabled:
        !!visitedViews.value?.length &&
        (tagItem.path === visitedViews.value[visitedViews.value!.length - 1].path ||
          selectedTag.value?.fullPath !== tagItem.path),
      command: 'closeRight',
    },
    {
      divided: true,
      icon: 'discount',
      label: '关闭其他',
      disabled: selectedTag.value?.fullPath !== tagItem.path,
      command: 'closeOther',
    },
  ]
  contextMenuRef.value?.openContextmenu(event, tagItem)
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
  const currentRoute = router.currentRoute.value
  if (currentRoute.name && !currentRoute.meta.breadCrumbStatus) {
    selectedTag.value = router.currentRoute.value
    tagsViewPlusStore.addVisitedViews(formatRoute(router.currentRoute.value))
  }
  scrollbarRef.value?.update()
  move(tagsViewPlusStore.visitedViews.length * 10)
}

/**
 * 关闭指定标签页
 * @param view 要关闭的标签页
 */
const closeSelectedTag = (view: TagsViewType) => {
  // 固定标签不允许关闭
  if (view.affixStatus) return
  tagsViewPlusStore.removeVisitedView(view)
  // 如果关闭的是当前激活的标签，则跳转到最后一个标签
  if (isActive(view)) {
    toLastView()
  }
}

/**
 * 刷新当前选中的标签页
 * @param view 要刷新的标签页
 */
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  if (!view) return
  const { path, query } = view
  await nextTick(() => {
    router
      .replace({
        path: '/redirect' + path,
        query: query,
      })
      .then()
  })
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
 * @param subItem 标签项
 */
const handleClickMenu = async (subItem: TagsViewType) => {
  await router
    .push(subItem.path)
    .then(() => {
      move(100)
    })
    .catch((_) => {
      useMessage().error('路由错误，请联系管理员!' + subItem.path)
    })
}

/**
 * 判断是否为当前激活的标签
 * @param route 标签路由信息
 * @returns boolean 是否为当前激活标签
 */
const isActive = (route: TagsViewType): boolean => {
  return route.path === unref(router.currentRoute).fullPath
}

/**
 * 处理滚动条滚动事件
 * @param param0 滚动事件参数
 */
const elScrollbarScroll = ({ scrollLeft }: any) => {
  scrollLeftNumber.value = scrollLeft as number
}

/**
 * 移动标签容器滚动位置
 * @param to 移动距离
 */
const move = (to: number = 0) => {
  scrollbarRef.value?.setScrollLeft(scrollLeftNumber.value + to)
}

/**
 * 组件挂载后初始化标签和位置
 */
onMounted(() => {
  initTags()
  move()
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
