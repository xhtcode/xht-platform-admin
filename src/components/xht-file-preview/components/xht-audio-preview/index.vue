<script lang="ts" setup>
import type { XhtAudioPreviewProps } from '@/components/xht-file-preview/components/xht-audio-preview/types'
import { Headset } from '@element-plus/icons-vue'

/**
 * 音频预览：原生 audio 播放器（浏览器自带控件，支持拖动进度、音量）
 *
 * 不引第三方播放器：预览只要求「能听」，原生控件在无障碍与快捷键上反而更完整；
 * 播放失败（编码不支持 / 文件损坏）时给明确提示，避免只剩一个禁用状态的控件。
 */
defineOptions({ name: 'XhtAudioPreview', inheritAttrs: false })

const props = withDefaults(defineProps<XhtAudioPreviewProps>(), { fileName: '' })

const state = reactive({
  errorStatus: false, // 音频加载失败
})

/**
 * 卡片标题：优先文件名，缺失时给通用文案（不回落存储key，避免长串乱码占满一行）
 */
const displayName = computed(() => props.fileName || '音频文件')

/**
 * 切文件时复位失败态
 */
watch(
  () => props.url,
  () => {
    state.errorStatus = false
  }
)
</script>

<template>
  <div class="wh-full flex-center">
    <div class="xht-audio-preview">
      <el-icon :size="56" class="xht-audio-preview-icon">
        <Headset />
      </el-icon>
      <p :title="displayName" class="xht-audio-preview-name">{{ displayName }}</p>
      <audio
        v-if="!state.errorStatus"
        :src="props.url"
        controls
        preload="metadata"
        class="xht-audio-preview-player"
        @error="state.errorStatus = true"
      />
      <p v-else class="xht-audio-preview-tip">音频加载失败，请下载后查看</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xht-audio-preview {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  max-width: 520px;
  padding: 40px 32px 32px;
  text-align: center;
  background-color: var(--xht-main-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--xht-border-radius-base);
}

.xht-audio-preview-icon {
  color: var(--el-text-color-placeholder);
}

.xht-audio-preview-name {
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

.xht-audio-preview-player {
  width: 100%;
  margin-top: 24px;
}

.xht-audio-preview-tip {
  margin: 20px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
