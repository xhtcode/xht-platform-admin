/**
 * 裁剪结果输出图片类型
 */
export type XhtAvatarUploadOutputType = 'png' | 'jpeg'

/**
 * VueCropper 实例方法（官方 typings 不含实例方法面，此处按需声明）
 */
export interface XhtAvatarCropperMethods {
  refresh(): void
  changeScale(num: number): void
  rotateLeft(): void
  rotateRight(): void
  getCropData(callback: (data: string) => void): void
  getCropBlob(callback: (data: Blob) => void): void
}

/**
 * 头像上传组件属性
 */
export interface XhtAvatarUploadProps {
  size?: number // 头像框尺寸（px，宽高一致）
  shape?: 'circle' | 'square' // 头像形状
  accept?: string // 可选择的文件类型
  maxSizeMb?: number // 允许选择的原图最大体积（MB）
  disabled?: boolean // 是否禁用
  cropSize?: number // 裁剪框宽高（px，正方形）
  outputType?: XhtAvatarUploadOutputType // 裁剪结果输出图片类型
}

/**
 * 头像上传组件 emit
 */
export interface XhtAvatarUploadEmits {
  (e: 'upload-success', value: string): void
}
