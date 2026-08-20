<script setup lang="ts">
import useRouterLoadingHooks from '@/hooks/use-router-loading'

defineOptions({
  name: 'LayoutMain',
})
const { loadingStatus } = useRouterLoadingHooks()
</script>

<template>
  <el-main class="xht-main-container" v-loading="loadingStatus">
    <router-view>
      <template #default="{ Component, route }">
        <transition name="main-view-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" v-if="route.meta?.keepAliveStatus" />
          </keep-alive>
        </transition>
        <transition name="main-view-animation" mode="out-in">
          <component :is="Component" :key="route.fullPath" v-if="!route.meta?.keepAliveStatus" />
        </transition>
      </template>
    </router-view>
  </el-main>
</template>
