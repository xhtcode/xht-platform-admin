<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus'
import { uploadSysFile } from '@/service/api/system/file.api'
import { useMessage } from '@/hooks/use-message'
import { UploadFilled, Upload } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFileUpload' })

const emits = defineEmits(['success'])
const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  loadingStatus: false, // 加载状态
  fileUsed: '', // 文件用途
  fileList: [] as UploadUserFile[], // 待上传文件列表
})

/**
 * 打开显示
 */
const show = () => {
  state.visibleStatus = true
  state.fileUsed = ''
  state.fileList = []
}

/**
 * 提交上传
 */
const submitUpload = async () => {
  const waitUploadFiles = state.fileList.filter((item) => item.raw && item.status !== 'success')
  if (waitUploadFiles.length <= 0) {
    useMessage().error('请选择需要上传的文件')
    return
  }
  state.loadingStatus = true
  let successCount = 0
  let failCount = 0
  for (const item of waitUploadFiles) {
    item.status = 'uploading'
    try {
      await uploadSysFile(item.raw as File, { fileUsed: state.fileUsed })
      item.status = 'success'
      successCount++
    } catch {
      // 失败原因已由请求拦截器统一提示
      item.status = 'fail'
      failCount++
    }
  }
  state.loadingStatus = false
  if (failCount <= 0) {
    useMessage().success('文件上传成功!')
    emits('success')
    close()
  } else {
    useMessage().error(`文件上传完成, 成功 ${successCount} 个, 失败 ${failCount} 个`)
    if (successCount > 0) {
      emits('success')
    }
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.fileUsed = ''
  state.fileList = []
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
    width="600px"
    :before-close="close"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form v-loading="state.loadingStatus" element-loading-text="拼命上传中" label-width="80px">
      <el-form-item label="文件用途">
        <el-input v-model="state.fileUsed" clearable :maxlength="100" placeholder="请输入文件用途（可选）" show-word-limit />
      </el-form-item>
      <el-form-item label="选择文件">
        <el-upload v-model:file-list="state.fileList" class="w-full" drag multiple :auto-upload="false">
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击选择文件</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持选择多个文件，选择完成后点击下方提交按钮进行上传</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
      <el-button :disabled="state.loadingStatus" :icon="Upload" type="primary" @click="submitUpload">提交上传</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  padding: 24px 0 8px;
}
</style>
