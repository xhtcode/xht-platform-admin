<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/store/modules/theme.store'
import { HomeDynamicRouter } from '@/router/modules/dynamic'

defineOptions({ name: 'BreadCrumb' })
const themeStore = useThemeStore()
const route = useRoute()
const breadcrumbList = ref<any[]>([])
const router = useRouter()
const { currentRoute } = useRouter()
const initBreadCrumb = (to: any) => {
  const currentRoute = to ? to : route
  const breadcrumbListEmp = currentRoute.matched
    .filter((item: RouteLocationNormalizedLoaded) => !['/', '/home'].includes(item.path))
    .filter((item: RouteLocationNormalizedLoaded) => !item.meta?.breadcrumb)
  if (breadcrumbListEmp.length > 0) {
    breadcrumbList.value = [HomeDynamicRouter, ...breadcrumbListEmp]
  } else {
    breadcrumbList.value = [HomeDynamicRouter]
  }
}
const handleRedirect = (item: any) => {
  router.push({ path: item.redirect || '/' })
}
// 页面加载时
onMounted(() => {
  initBreadCrumb(null)
})
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded | any) => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    initBreadCrumb(route)
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <el-breadcrumb v-if="themeStore.breadcrumb" separator="/" class="breadcrumb-container">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
        <div v-if="index !== breadcrumbList.length - 1" class="h-full flex cursor-pointer items-center gap-2" @click="handleRedirect(item)">
          <div :class="`i-menu-${item.meta.icon}`" class="text-12px" />
          <div class="h-full flex items-center text-14px" style="line-height: 50px">
            {{ item.meta.title }}
          </div>
        </div>
        <div v-else class="h-full flex items-center gap-2">
          <div :class="`i-menu-${item.meta.icon}`" class="text-12px" />
          <div class="h-full flex items-center text-14px" style="line-height: 50px">
            {{ item.meta.title }}
          </div>
        </div>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.breadcrumb-container {
  height: 100%;
  display: flex;
  justify-items: center;
  user-select: none;

  :deep(.el-breadcrumb__inner) {
    height: 100%;
  }
}

/* Breadcrumb 面包屑过渡动画
------------------------------- */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
  z-index: -1;
}
</style>
