<script lang="ts" setup>
import type { UploadInstance, UploadRawFile, UploadUserFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { mergeSysFileChunk, querySysFileChunkProgress, uploadSysFile, uploadSysFileChunk } from '@/service/api/system/file.api'
import { useMessage } from '@/hooks/use-message'
import { generateUUID } from '@/utils/index'
import { UploadFilled, Upload } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFileUpload' })

const emits = defineEmits(['success'])

/**
 * 分片大小：5MB（与服务端建议保持一致，最后一片允许不足）
 */
const CHUNK_SIZE = 5 * 1024 * 1024

const uploadRef = useTemplateRef<UploadInstance>('uploadRef')
const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  loadingStatus: false, // 加载状态
  fileUsed: '', // 文件用途
  fileList: [] as UploadUserFile[], // 待上传文件列表（仅允许单个文件）
  chunkStatus: false, // 是否走分片上传
  chunkTotal: 0, // 分片总数
  chunkUploaded: 0, // 已上传分片数（含跳过）
  chunkProgress: 0, // 分片上传进度百分比
})

/**
 * 重置表单数据
 */
const resetState = () => {
  state.fileUsed = ''
  state.fileList = []
  state.chunkStatus = false
  state.chunkTotal = 0
  state.chunkUploaded = 0
  state.chunkProgress = 0
}

/**
 * 打开显示
 */
const show = () => {
  state.visibleStatus = true
  resetState()
}

/**
 * 超出文件数量限制（单文件上传，新选择文件直接替换原文件）
 *
 * @param files 本次选择的文件列表
 */
const handleExceed = (files: File[]) => {
  const rawFile = files[0] as UploadRawFile
  if (!rawFile) return
  uploadRef.value?.clearFiles()
  rawFile.uid = genFileId()
  uploadRef.value?.handleStart(rawFile)
}

/**
 * 分片上传大文件
 *
 * 流程：生成 uploadId → 查询已上传分片（断点续传）→ 逐片上传 → 合并生成文件记录
 *
 * @param file 待上传文件
 * @param fileUsed 文件用途标识
 */
const uploadByChunk = async (file: File, fileUsed?: string) => {
  const chunkTotal = Math.ceil(file.size / CHUNK_SIZE)
  state.chunkStatus = true
  state.chunkTotal = chunkTotal
  state.chunkProgress = 0
  // uploadId 使用 UUID（文档推荐 MD5 或 UUID，UUID 无需额外哈希依赖）
  const uploadId = generateUUID()
  // 断点续传：查询已上传分片，跳过后仅补传缺失部分
  const { data: uploadedChunks = [] } = await querySysFileChunkProgress(uploadId)
  const uploadedSet = new Set(uploadedChunks)
  for (let chunkIndex = 0; chunkIndex < chunkTotal; chunkIndex++) {
    if (!uploadedSet.has(chunkIndex)) {
      const start = chunkIndex * CHUNK_SIZE
      const chunk = file.slice(start, Math.min(start + CHUNK_SIZE, file.size))
      await uploadSysFileChunk(chunk, uploadId, chunkIndex)
    }
    state.chunkUploaded = uploadedSet.size + Math.max(0, chunkIndex + 1 - uploadedSet.size)
    state.chunkProgress = Math.floor(((chunkIndex + 1) / chunkTotal) * 100)
  }
  return await mergeSysFileChunk({ uploadId, fileName: file.name, chunkTotal, fileUsed })
}

/**
 * 提交上传
 */
const submitUpload = async () => {
  const targetFile = state.fileList[0]
  if (!targetFile?.raw) {
    useMessage().error('请选择需要上传的文件')
    return
  }
  if (targetFile.status === 'success') {
    useMessage().warning('该文件已上传成功, 请勿重复提交')
    return
  }
  state.loadingStatus = true
  targetFile.status = 'uploading'
  const rawFile = targetFile.raw as File
  let successStatus = false
  try {
    if (rawFile.size > CHUNK_SIZE) {
      // 大文件走分片上传
      await uploadByChunk(rawFile, state.fileUsed || undefined)
    } else {
      await uploadSysFile(rawFile, { fileUsed: state.fileUsed || undefined })
    }
    targetFile.status = 'success'
    successStatus = true
  } catch {
    // 失败原因已由请求拦截器统一提示
    targetFile.status = 'fail'
  } finally {
    state.loadingStatus = false
  }
  if (successStatus) {
    useMessage().success('文件上传成功!')
    emits('success')
    close()
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  resetState()
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    append-to-body
    title="上传文件"
    fullscreen
    :before-close="close"
    align-center
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form v-loading="state.loadingStatus" element-loading-text="拼命上传中" label-width="80px">
      <el-form-item label="文件用途">
        <el-input v-model="state.fileUsed" clearable :maxlength="100" placeholder="请输入文件用途（可选）" show-word-limit />
      </el-form-item>
      <el-form-item label="选择文件">
        <el-upload ref="uploadRef" v-model:file-list="state.fileList" drag :auto-upload="false" :limit="1" :on-exceed="handleExceed">
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击选择文件</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">仅支持单个文件上传，重新选择将替换已选文件；超过 5MB 的文件将自动分片上传</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="state.chunkStatus">
        <el-progress :percentage="state.chunkProgress" class="w-full" striped striped-flow />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
      <el-button :disabled="state.loadingStatus" :icon="Upload" type="primary" @click="submitUpload">提交上传</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-upload-dragger {
  padding: 0 !important;
}
</style>
