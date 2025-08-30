<template>
  <div v-if="themeStore.breadcrumb">
    <el-breadcrumb class="layout-breadcrumb-container user-select-none" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
          <span
            v-if="index !== breadcrumbList.length - 1"
            class="layout-breadcrumb-container-icon cursor-pointer flex-center"
            @click="handleRedirect(item)"
          >
            <svg-icon :name="item.meta.icon" class="mr-5" />
            {{ item.meta.title }}
          </span>
          <span v-else class="layout-breadcrumb-container-span flex-center cursor-default">
            <svg-icon
              :name="item.meta.icon"
              class="layout-breadcrumb-container-icon flex-center mr-5"
            />
            {{ item.meta.title }}
          </span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

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
  (route: RouteLocationNormalizedLoaded) => {
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

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.layout-breadcrumb-container {
  .layout-breadcrumb-container-span {
    height: $header-height;
    opacity: 0.7;
    white-space: nowrap;
  }

  .layout-breadcrumb-container-icon {
    height: $header-height;
    white-space: nowrap;
  }
}

// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
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
