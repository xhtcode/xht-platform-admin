<template>
  <el-main class="xht-main-container" v-loading="loadingStatus">
    <router-view>
      <template #default="{ Component, route }">
        <Transition name="main-view-animation" mode="out-in">
          <keep-alive v-if="refreshStatus">
            <component :is="Component" :key="route.fullPath" class="w-full" />
          </keep-alive>
        </Transition>
      </template>
    </router-view>
  </el-main>
</template>

<script setup lang="ts">
import useRouterLoadingHooks from '@/hooks/use-router-loading'

defineOptions({
  name: 'LayoutMain',
})
const { loadingStatus, refreshStatus } = useRouterLoadingHooks()
</script>

<style scoped lang="scss">
.xht-main-container {
  position: relative;
  box-sizing: border-box;
  padding: 8px;
  overflow-x: hidden;
  background-color: var(--xht-page-bg-color);
}
</style>
