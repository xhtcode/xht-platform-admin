<script lang="ts" setup>
import { querySysFileById } from '@/service/api/system/file.api'
import type { SysFileResponse } from '@/service/model/system/file.model'
import { fileStatusEnum, fileStorageTypeEnum } from '@/service/enums/system/file.enum'
import { handleDownloadSysFile } from '@/views/system/file/file.utils'
import { useMessage } from '@/hooks/use-message'
import { Download } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFileDetail' })

const state = reactive({
  visibleStatus: false, // 抽屉可见状态
  loadingStatus: false, // 加载状态
  fileInfo: {} as SysFileResponse, // 文件详情
})

/**
 * 打开显示
 *
 * @param row 文件列表行数据
 */
const show = async (row: SysFileResponse) => {
  state.visibleStatus = true
  state.loadingStatus = true
  state.fileInfo = row
  try {
    const { data } = await querySysFileById(row.id)
    state.fileInfo = data
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 下载文件
 */
const handleDownload = async () => {
  state.loadingStatus = true
  try {
    const successStatus = await handleDownloadSysFile(state.fileInfo.fileStorageKey)
    if (successStatus) {
      useMessage().success('文件下载成功!')
    }
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.fileInfo = {} as SysFileResponse
  state.visibleStatus = false
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    title="文件详情"
    size="60%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="close"
  >
    <div v-loading="state.loadingStatus" element-loading-text="拼命加载中" class="h-full overflow-auto">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="文件ID">{{ state.fileInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="文件状态">
          <xht-enum-tag :filter-label="state.fileInfo.fileStatus" :data="fileStatusEnum" />
        </el-descriptions-item>
        <el-descriptions-item label="文件原始名称" :span="2">{{ state.fileInfo.fileOriginalName }}</el-descriptions-item>
        <el-descriptions-item label="文件类型">{{ state.fileInfo.fileType }}</el-descriptions-item>
        <el-descriptions-item label="文件后缀">{{ state.fileInfo.fileSuffix }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">
          {{ state.fileInfo.fileSizeInfo }}<span v-if="state.fileInfo.fileSize">（{{ state.fileInfo.fileSize }} 字节）</span>
        </el-descriptions-item>
        <el-descriptions-item label="文件用途">{{ state.fileInfo.fileUsed }}</el-descriptions-item>
        <el-descriptions-item label="存储类型">
          <xht-enum-tag :filter-label="state.fileInfo.fileStorageType" :data="fileStorageTypeEnum" />
        </el-descriptions-item>
        <el-descriptions-item label="存储名称">{{ state.fileInfo.fileStorageName }}</el-descriptions-item>
        <el-descriptions-item label="存储Key" :span="2">{{ state.fileInfo.fileStorageKey }}</el-descriptions-item>
        <el-descriptions-item label="存储路径" :span="2">{{ state.fileInfo.fileStoragePath }}</el-descriptions-item>
        <el-descriptions-item label="文件hash" :span="2">
          <span class="break-all">{{ state.fileInfo.fileHash }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="预览地址" :span="2">
          <el-link v-if="state.fileInfo.filePreviewUrl" :href="state.fileInfo.filePreviewUrl" target="_blank" type="primary">
            {{ state.fileInfo.filePreviewUrl }}
          </el-link>
          <span v-else>暂无</span>
        </el-descriptions-item>
        <el-descriptions-item label="上传时间">{{ state.fileInfo.fileUploadTime }}</el-descriptions-item>
        <el-descriptions-item label="上传用户">{{ state.fileInfo.fileUploadUser }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ state.fileInfo.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ state.fileInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新人">{{ state.fileInfo.updateBy }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ state.fileInfo.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="文件元数据" :span="2">
          <pre class="file-metadata">{{ state.fileInfo.fileMetadata ? JSON.stringify(state.fileInfo.fileMetadata, null, 2) : '暂无' }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
      <el-button :disabled="state.loadingStatus" :icon="Download" type="primary" @click="handleDownload">下载</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.file-metadata {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
