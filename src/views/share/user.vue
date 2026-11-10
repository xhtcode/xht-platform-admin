<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import { useTitle } from '@/hooks/use-title'
import SwitchDark from '@/layout/components/switch-dark/index.vue'
import PageFullScreen from '@/layout/components/page-full-screen/index.vue'
import ShareAccess from '@/views/share/components/share-access.vue'

defineOptions({ name: 'ShareUserViewIndex' })

const route = useRoute()
const router = useRouter()
const { setTitle } = useTitle()

/**
 * 分享ID
 */
const shareId = computed(() => (route.params.shareId ? String(route.params.shareId) : ''))

/**
 * 返回分享中心（非接收人 / 失效时的人工出口）
 */
const backToShareCenter = () => {
  void router.push('/basic/file-share')
}

onMounted(() => {
  setTitle('文件分享')
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
        <el-button :icon="Back" link size="small" type="primary" @click="backToShareCenter">分享中心</el-button>
        <switch-dark />
        <page-full-screen />
      </div>
    </header>
    <main class="share-page-main">
      <share-access v-if="shareId" mode="user" :target="shareId" />
      <el-result v-else icon="warning" title="分享链接不完整" sub-title="缺少分享ID，请从分享中心重新打开">
        <template #extra>
          <el-button type="primary" @click="backToShareCenter">返回分享中心</el-button>
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
  gap: 6px;
}

.share-page-main {
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
</style>
