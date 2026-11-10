<script lang="ts" setup>
import { Download, Lock, RefreshLeft } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message'
import { openLinkShare, openUserShare, queryLinkShareMeta, queryUserShareMeta } from '@/service/api/system/file-share.api'
import { initSysFilePreview } from '@/service/api/system/file.api'
import type { SysFileShareMetaResponse } from '@/service/model/system/file-share.model'
import { BusinessError } from '@/utils/business-error'
import { handleDownloadPreviewFile } from '@/utils/file'
import { PreviewApiError } from '@/utils/file-preview'

defineOptions({ name: 'ShareAccess' })

const props = defineProps<{
  mode: 'link' | 'user' // link：链接分享（匿名）；user：指定用户分享（需登录且是接收人）
  target: string // 链接分享为 token，指定用户分享为 shareId
}>()

const message = useMessage()

/**
 * 提取码错误次数过多时的锁定码
 */
const CODE_LOCKED = 50227

const state = reactive({
  loadingStatus: true, // 元信息加载中
  openingStatus: false, // 提取码校验 / 打开中
  errorMessage: '', // 元信息加载失败信息
  invalidStatus: false, // 分享已失效（撤销 / 过期 / 不存在）
  meta: null as SysFileShareMetaResponse | null,
  accessCode: '',
  // 打开成功后拿到的票据（只放内存，不放 URL）
  shareTicket: '',
  // 仅下载权限：init 后直接下载
  downloadOnlyStatus: false,
  downloadingStatus: false,
})

/**
 * 是否需要先输入提取码
 */
const needCodeStatus = computed(() => !!state.meta?.requireCode && !state.shareTicket)

/**
 * 分享是否已过期（status 正常但超过有效期）
 */
const expiredStatus = computed(() => {
  if (!state.meta?.expireAt) return false
  const now = new Date()
  const pad = (value: number) => `${value}`.padStart(2, '0')
  const nowText = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  return state.meta.expireAt < nowText
})

/**
 * 失效原因文案
 */
const invalidTip = computed(() => {
  if (state.errorMessage) return state.errorMessage
  if (state.meta && state.meta.status === 0) return '该分享已被撤销'
  if (expiredStatus.value) return '该分享已过期'
  return '分享不存在或已失效'
})

/**
 * 加载分享元信息
 */
const loadMeta = async () => {
  state.loadingStatus = true
  state.errorMessage = ''
  state.invalidStatus = false
  state.shareTicket = ''
  try {
    const { data } = props.mode === 'link' ? await queryLinkShareMeta(props.target) : await queryUserShareMeta(props.target)
    state.meta = data
    if (data.status !== 1 || expiredStatus.value) {
      state.invalidStatus = true
      return
    }
    // 无需提取码时直接打开，避免用户多点一次
    if (!data.requireCode) {
      await handleOpen()
    }
  } catch (error) {
    console.error('分享信息加载失败:', error)
    state.invalidStatus = true
    state.errorMessage = (error as BusinessError).message
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 打开分享（校验提取码，拿票据）
 */
const handleOpen = async () => {
  if (state.openingStatus) return
  state.openingStatus = true
  try {
    const { data } =
      props.mode === 'link'
        ? await openLinkShare(props.target, state.accessCode || undefined)
        : await openUserShare(props.target, state.accessCode || undefined)
    state.shareTicket = data.shareTicket
    // 「仅下载」权限不渲染预览，先 init 拿 previewId 再直接下载
    if (data.permission === 'DOWNLOAD') {
      await handleDownloadOnly()
    }
  } catch (error) {
    if (error instanceof BusinessError && error.code === CODE_LOCKED) {
      message.warning('提取码错误次数过多，请稍后再试')
    }
    // 其余失败（50225 失效 / 50226 提取码错误 / 50231 未授权）提示已由拦截器给出
    console.error('打开分享失败:', error)
  } finally {
    state.openingStatus = false
  }
}

/**
 * 仅下载权限：init 后直接下载原始文件
 */
const handleDownloadOnly = async () => {
  state.downloadOnlyStatus = true
  state.downloadingStatus = true
  try {
    const { data } = await initSysFilePreview({ shareTicket: state.shareTicket })
    await handleDownloadPreviewFile(data.previewId)
    message.success('文件下载成功!')
  } catch (error) {
    console.error('分享文件下载失败:', error)
    if (error instanceof PreviewApiError) {
      message.error(error.message || '文件下载失败')
    }
  } finally {
    state.downloadingStatus = false
  }
}

watch(() => [props.mode, props.target], loadMeta, { immediate: true })
</script>

<template>
  <div class="share-access">
    <!-- 元信息加载中 -->
    <div v-if="state.loadingStatus" v-loading="true" class="share-access-loading" element-loading-text="正在打开分享" />

    <!-- 已失效 / 无权限 -->
    <el-result v-else-if="state.invalidStatus" class="share-access-result" icon="warning" title="无法打开该分享">
      <template #sub-title>
        <span>{{ invalidTip }}</span>
      </template>
      <template #extra>
        <el-button :icon="RefreshLeft" @click="loadMeta">重新加载</el-button>
      </template>
    </el-result>

    <!-- 提取码表单 -->
    <div v-else-if="needCodeStatus" class="share-access-card">
      <el-icon :size="40" class="share-access-icon"><Lock /></el-icon>
      <p :title="state.meta?.fileName" class="share-access-name">{{ state.meta?.fileName }}</p>
      <p class="share-access-meta">{{ state.meta?.creatorName }} 分享 · {{ state.meta?.fileSizeInfo }} · 有效期至 {{ state.meta?.expireAt }}</p>
      <el-input
        v-model="state.accessCode"
        class="share-access-code"
        maxlength="8"
        placeholder="请输入提取码"
        show-word-limit
        @keyup.enter="handleOpen"
      />
      <el-button :loading="state.openingStatus" type="primary" class="share-access-submit" @click="handleOpen">打开分享</el-button>
    </div>

    <!-- 仅下载权限 -->
    <div v-else-if="state.downloadOnlyStatus" class="share-access-card">
      <el-icon :size="40" class="share-access-icon"><Download /></el-icon>
      <p :title="state.meta?.fileName" class="share-access-name">{{ state.meta?.fileName }}</p>
      <p class="share-access-meta">该分享仅授予下载权限</p>
      <el-button :icon="Download" :loading="state.downloadingStatus" type="primary" @click="handleDownloadOnly">
        {{ state.downloadingStatus ? '正在下载' : '下载文件' }}
      </el-button>
    </div>

    <!-- 正常预览 -->
    <xht-file-preview v-else-if="state.shareTicket" :share-ticket="state.shareTicket" />
  </div>
</template>

<style lang="scss" scoped>
.share-access {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.share-access-loading,
.share-access-result {
  width: 100%;
  height: 100%;
}

.share-access-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  max-width: 440px;
  padding: 40px 32px 32px;
  text-align: center;
  background-color: var(--xht-main-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--xht-border-radius-base);
  box-shadow: 0 0 12px var(--xht-shadow-color-lightest);
}

.share-access-icon {
  color: var(--el-color-primary);
}

.share-access-name {
  max-width: 100%;
  margin: 16px 0 0;
  overflow: hidden;
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-access-meta {
  margin: 6px 0 20px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.share-access-code {
  width: 100%;
}

.share-access-submit {
  width: 100%;
  margin-top: 16px;
}
</style>
