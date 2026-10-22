<script lang="ts" setup>
import type { UploadInstance, UploadRawFile, UploadUserFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { uploadSysFile } from '@/service/api/system/file.api'
import { useMessage } from '@/hooks/use-message'
import { UploadFilled, Upload } from '@element-plus/icons-vue'

defineOptions({ name: 'SysFileUpload' })

const emits = defineEmits(['success'])
const uploadRef = useTemplateRef<UploadInstance>('uploadRef')
const state = reactive({
  visibleStatus: false, // 弹窗可见状态
  loadingStatus: false, // 加载状态
  fileUsed: '', // 文件用途
  fileDesc: '', // 文件描述
  fileList: [] as UploadUserFile[], // 待上传文件列表（仅允许单个文件）
})

/**
 * 重置表单数据
 */
const resetState = () => {
  state.fileUsed = ''
  state.fileDesc = ''
  state.fileList = []
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
  let successStatus = false
  try {
    await uploadSysFile(targetFile.raw as File, { fileUsed: state.fileUsed, fileDesc: state.fileDesc })
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
    width="600px"
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
            <div class="el-upload__tip">仅支持单个文件上传，重新选择将替换已选文件，确认后点击下方提交按钮进行上传</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件描述">
        <el-input
          v-model="state.fileDesc"
          clearable
          :maxlength="200"
          placeholder="请输入文件描述（可选）"
          show-word-limit
          type="textarea"
          :rows="5"
          resize="none"
        />
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
