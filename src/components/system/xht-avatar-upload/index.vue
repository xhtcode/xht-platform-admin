<script setup lang="ts">
import type { UploadFile, UploadRawFile } from 'element-plus'
import { Plus, Refresh, RefreshLeft, RefreshRight, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
// vue-cropper 1.1.x 的根路径 typings 有缺陷（见 src/typings/vue-cropper.d.ts 说明），故深导入 dist 产物；样式为独立 CSS 需单独引入
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper/dist/vue-cropper.es.js'
import type { XhtAvatarCropperMethods, XhtAvatarUploadEmits, XhtAvatarUploadProps } from '@/components/system/xht-avatar-upload/types'
import { uploadSysUserAvatar } from '@/service/api/system/user.api'
import { useMessage } from '@/hooks/use-message'
import { resolveAvatarUrl } from '@/utils/file'

defineOptions({
  name: 'XhtAvatarUpload',
  inheritAttrs: true,
})

const props = withDefaults(defineProps<XhtAvatarUploadProps>(), {
  size: 100, // 头像框尺寸（px）
  shape: 'circle', // 头像形状
  accept: 'image/*', // 可选择的文件类型
  maxSizeMb: 5, // 原图最大体积（MB）
  disabled: false, // 是否禁用
  dialogTitle: '修改头像', // 裁剪弹窗标题
  cropSize: 200, // 裁剪框宽高（px）
  outputType: 'png', // 裁剪输出图片类型
})

const emits = defineEmits<XhtAvatarUploadEmits>()

/**
 * 头像值（双向绑定）
 */
const modelValue = defineModel<string | undefined>('modelValue', {
  required: true,
})

/**
 * 裁剪弹窗显示状态
 */
const dialogVisible = ref(false)

/**
 * 提交中状态
 */
const uploadingStatus = ref(false)

/**
 * 已选择的原图文件（重置时用于重新加载；来源为已有头像地址时为空）
 */
const originalFile = ref<UploadRawFile>()

/**
 * 已有头像的地址（来源为本地文件时为空）
 */
const originalUrl = ref('')

/**
 * VueCropper 输入地址（本地 objectURL 或已有头像地址）
 */
const cropperImg = ref('')

/**
 * VueCropper 实例
 */
const cropperRef = useTemplateRef<XhtAvatarCropperMethods>('cropperRef')

/**
 * 实时预览数据（realTime 事件回传）
 */
const cropPreview = ref<Record<string, Record<string, string> | string | undefined>>({})

/**
 * 本次会话内的本地预览地址（上传成功后立即展示，刷新后回退到外链地址）
 */
const localPreviewSrc = ref('')

/**
 * 展示地址：优先本地预览，其次由头像值解析出的可访问地址
 */
const displaySrc = computed<string>(() => {
  return localPreviewSrc.value || resolveAvatarUrl(modelValue.value)
})

/**
 * 头像框公共样式（尺寸与形状）
 */
const avatarBoxStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    borderRadius: props.shape === 'circle' ? '50%' : 'var(--el-border-radius-base)',
  }
})

/**
 * 释放本地预览地址
 */
const clearLocalPreview = (): void => {
  if (localPreviewSrc.value) {
    URL.revokeObjectURL(localPreviewSrc.value)
    localPreviewSrc.value = ''
  }
}

/**
 * 外部把值清空时同步清理本地预览，避免残留旧图
 */
watch(
  () => modelValue.value,
  (value) => {
    if (!value) clearLocalPreview()
  }
)

/**
 * 释放裁剪器当前地址（仅释放本组件创建的 objectURL，外部地址不可回收）
 */
const releaseCropperImg = (): void => {
  if (cropperImg.value.startsWith('blob:')) {
    URL.revokeObjectURL(cropperImg.value)
  }
  cropperImg.value = ''
}

/**
 * 加载本地文件到裁剪器（重复调用会释放旧地址，效果等同重置）
 * @param file 原图文件
 */
const loadOriginalFile = (file: UploadRawFile): void => {
  releaseCropperImg()
  originalFile.value = file
  originalUrl.value = ''
  cropperImg.value = URL.createObjectURL(file)
  cropPreview.value = {}
}

/**
 * 加载已有头像地址到裁剪器（打开弹窗时预加载当前头像）
 * @param url 头像地址
 */
const loadOriginalUrl = (url: string): void => {
  releaseCropperImg()
  originalFile.value = undefined
  originalUrl.value = url
  cropperImg.value = url
  cropPreview.value = {}
}

/**
 * 打开裁剪弹窗（已有头像时，按前缀解析出可访问地址后预加载进裁剪器）
 */
const handleOpenDialog = (): void => {
  if (props.disabled) return
  if (!cropperImg.value && modelValue.value) {
    loadOriginalUrl(resolveAvatarUrl(modelValue.value))
  }
  dialogVisible.value = true
}

/**
 * 弹窗关闭后清理裁剪现场
 */
const handleDialogClosed = (): void => {
  releaseCropperImg()
  originalFile.value = undefined
  originalUrl.value = ''
  cropPreview.value = {}
  uploadingStatus.value = false
}

/**
 * 选择图片（弹窗内「选择」按钮）
 * @param uploadFile el-upload change 事件参数
 */
const handleFileSelect = (uploadFile: UploadFile): void => {
  const raw = uploadFile.raw
  if (!raw) return
  if (!raw.type.startsWith('image/')) {
    useMessage().warning('仅支持选择图片文件')
    return
  }
  if (raw.size > props.maxSizeMb * 1024 * 1024) {
    useMessage().warning(`图片大小不能超过 ${props.maxSizeMb}MB`)
    return
  }
  loadOriginalFile(raw)
}

/**
 * 实时预览回调
 * @param data VueCropper realTime 事件数据
 */
const handleRealTime = (data: Record<string, Record<string, string> | string | undefined>): void => {
  cropPreview.value = data
}

/**
 * 缩放裁剪图（正数放大，负数缩小）
 * @param num 缩放倍数
 */
const handleScale = (num: number): void => {
  cropperRef.value?.changeScale(num)
}

/**
 * 重置裁剪（重新加载原图，回到初始缩放/旋转/位置）
 */
const handleReset = (): void => {
  if (originalFile.value) {
    loadOriginalFile(originalFile.value)
  } else if (originalUrl.value) {
    loadOriginalUrl(originalUrl.value)
  }
}

/**
 * 提交裁剪结果：导出裁剪图并走头像上传接口
 */
const handleSubmit = async (): Promise<void> => {
  if (!cropperImg.value || uploadingStatus.value) return
  const cropper = cropperRef.value
  if (!cropper) return
  uploadingStatus.value = true
  try {
    const blob = await new Promise<Blob>((resolve) => {
      cropper.getCropBlob((data: Blob) => resolve(data))
    })
    const croppedFile = new File([blob], `avatar.${props.outputType}`, { type: blob.type })
    // 专属头像上传接口：/sys/user/upload/avatar，form-data 字段名固定为 avatar
    const { data } = await uploadSysUserAvatar(croppedFile)
    clearLocalPreview()
    localPreviewSrc.value = URL.createObjectURL(blob)
    modelValue.value = data
    useMessage().success('头像修改成功')
    emits('upload-success', data)
    emits('change', modelValue.value)
    dialogVisible.value = false
  } catch (error) {
    console.error('头像上传失败:', error)
  } finally {
    uploadingStatus.value = false
  }
}
</script>

<template>
  <div class="xht-avatar-upload">
    <div class="avatar-box" :class="{ 'is-clickable': !props.disabled }" :style="avatarBoxStyle" @click="handleOpenDialog">
      <el-image v-if="displaySrc" :src="displaySrc" fit="cover" class="avatar-image" />
      <el-icon v-else :size="props.size / 3" class="avatar-placeholder">
        <Plus />
      </el-icon>
      <div v-if="!props.disabled" class="avatar-mask">点击修改</div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="props.dialogTitle"
      width="780px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="!uploadingStatus"
      @closed="handleDialogClosed"
    >
      <div class="crop-layout">
        <div class="crop-area">
          <el-upload
            v-if="!cropperImg"
            :accept="props.accept"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileSelect"
            class="crop-empty-upload"
          >
            <div class="crop-empty">
              <el-icon :size="32"><Plus /></el-icon>
              <span>点击触发上传</span>
            </div>
          </el-upload>
          <VueCropper
            v-else
            ref="cropperRef"
            :img="cropperImg"
            :output-size="1"
            :output-type="props.outputType"
            :info="true"
            :can-scale="true"
            :auto-crop="true"
            :auto-crop-width="props.cropSize"
            :auto-crop-height="props.cropSize"
            :fixed-box="true"
            :fixed="true"
            :fixed-number="[1, 1]"
            :can-move-box="false"
            :center-box="true"
            mode="contain"
            @real-time="handleRealTime"
          />
        </div>
        <div class="crop-preview">
          <div class="crop-preview-circle" :class="`is-${props.shape}`" :style="{ width: `${props.cropSize}px`, height: `${props.cropSize}px` }">
            <div :style="cropPreview.div">
              <img v-if="cropPreview.url" :src="cropPreview.url" :style="cropPreview.img" alt="" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="crop-toolbar">
          <div class="flex items-center">
            <el-upload :accept="props.accept" :show-file-list="false" :auto-upload="false" :on-change="handleFileSelect" class="mr-2">
              <el-button :icon="Plus" plain type="primary">选择</el-button>
            </el-upload>
            <el-button :disabled="!cropperImg || uploadingStatus" circle title="放大" @click="handleScale(1)">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
            <el-button :disabled="!cropperImg || uploadingStatus" circle title="缩小" @click="handleScale(-1)">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
            <el-button :disabled="!cropperImg || uploadingStatus" circle title="左旋转" @click="cropperRef?.rotateLeft()">
              <el-icon><RefreshLeft /></el-icon>
            </el-button>
            <el-button :disabled="!cropperImg || uploadingStatus" circle title="右旋转" @click="cropperRef?.rotateRight()">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
            <el-button :disabled="!cropperImg || uploadingStatus" circle title="重置" @click="handleReset">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
          <el-button :disabled="!cropperImg" :loading="uploadingStatus" type="primary" @click="handleSubmit">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.avatar-box {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--el-border-color);
  background-color: var(--el-fill-color-light);
  transition: border-color var(--el-transition-duration);

  &.is-clickable {
    cursor: pointer;

    &:hover {
      border-color: var(--el-color-primary);

      .avatar-mask {
        opacity: 1;
      }
    }
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  color: var(--el-text-color-secondary);
}

.avatar-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-white);
  background-color: var(--el-mask-color);
  opacity: 0;
  transition: opacity var(--el-transition-duration);
}

.crop-layout {
  overflow: hidden;
  display: flex;
  gap: var(--el-gap, 24px);
}

.crop-area {
  width: 480px;
  height: 400px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: var(--el-fill-color-darker);
}

.crop-empty-upload {
  display: block;
  width: 100%;
  height: 100%;

  :deep(.el-upload) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.crop-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--el-gap, 12px);
  width: 100%;
  height: 100%;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.crop-preview {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.crop-preview-circle {
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  background-color: var(--el-fill-color-darker);

  &.is-circle {
    border-radius: 50%;
  }

  &.is-square {
    border-radius: var(--el-border-radius-base);
  }

  img {
    display: block;
    max-width: none;
  }
}

.crop-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
