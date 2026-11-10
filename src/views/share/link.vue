<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useTitle } from '@/hooks/use-title'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import ShareAccess from '@/views/share/components/share-access.vue'

defineOptions({ name: 'ShareLinkViewIndex' })

const route = useRoute()
const { setTitle } = useTitle()

/**
 * 链接分享定位串
 */
const token = computed(() => (route.params.token ? String(route.params.token) : ''))

onMounted(() => {
  setTitle('文件分享')
  // 分享页可能带提取码，禁止被搜索引擎索引：动态插入 robots 元信息，卸载时移除
  const robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex, nofollow'
  robots.dataset.sharePage = 'true'
  document.head.appendChild(robots)
})

onBeforeUnmount(() => {
  document.head.querySelectorAll('meta[data-share-page="true"]').forEach((el) => el.remove())
})
</script>

<template>
  <div class="share-page">
    <header class="share-page-header">
      <span class="share-page-title">文件分享</span>
      <div class="share-page-tools">
        <switch-dark />
        <page-full-screen />
      </div>
    </header>
    <main class="share-page-main">
      <share-access v-if="token" mode="link" :target="token" />
      <el-result v-else icon="warning" title="分享链接不完整" sub-title="请确认链接是否被截断">
        <template #extra>
          <el-button type="primary" @click="$router.replace('/')">返回首页</el-button>
        </template>
      </el-result>
    </main>
  </div>
</template>

<style scoped lang="scss">
.share-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--el-text-color-primary);
  background-color: var(--xht-main-bg-color);
}

.share-page-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color-light);
  user-select: none;
}

.share-page-title {
  font-weight: 600;
  font-size: 14px;
}

.share-page-tools {
  display: flex;
  align-items: center;
}

.share-page-main {
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
</style>
