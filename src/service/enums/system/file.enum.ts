import type {
  FileAccessScope,
  FileImageMode,
  FileInitStatus,
  FilePreviewSource,
  FilePreviewType,
  FileStatus,
  FileStorageType,
  FileWatermarkLevel,
} from '@/service/model/system/file.model'
import type { FileShareMode, FileSharePermission, FileShareStatus } from '@/service/model/system/file-share.model'

/**
 * 文件状态
 */
export const fileStatusEnum: DictEnum<FileStatus, 'UPLOADED' | 'ASSOCIATED' | 'DELETED'> = {
  UPLOADED: {
    label: '已上传',
    value: 1,
    type: 'success',
  },
  ASSOCIATED: {
    label: '已关联业务',
    value: 2,
    type: 'primary',
  },
  DELETED: {
    label: '已删除',
    value: 99,
    type: 'danger',
  },
}

/**
 * 文件预览类型
 */
export const filePreviewTypeEnum: DictEnum<FilePreviewType, 'IMAGE' | 'PDF' | 'VIDEO' | 'AUDIO' | 'TEXT' | 'JSON' | 'OTHER'> = {
  IMAGE: {
    label: '图片',
    value: 'image',
    type: 'success',
  },
  PDF: {
    label: 'PDF',
    value: 'pdf',
    type: 'danger',
  },
  VIDEO: {
    label: '视频',
    value: 'video',
    type: 'warning',
  },
  AUDIO: {
    label: '音频',
    value: 'audio',
    type: 'warning',
  },
  TEXT: {
    label: '文本',
    value: 'text',
    type: 'info',
  },
  JSON: {
    label: 'JSON',
    value: 'json',
    type: 'primary',
  },
  OTHER: {
    label: '其他',
    value: 'other',
    type: 'info',
  },
}

/**
 * 预览初始化状态
 *
 * 0 成功 / 1 转换中 / 2 不支持预览 / 3 转换失败 / 4 仅下载
 */
export const fileInitStatusEnum: DictEnum<FileInitStatus, 'SUCCESS' | 'CONVERTING' | 'NOT_SUPPORTED' | 'FAILED' | 'DOWNLOAD_ONLY'> = {
  SUCCESS: {
    label: '可预览',
    value: 0,
    type: 'success',
  },
  CONVERTING: {
    label: '转换中',
    value: 1,
    type: 'warning',
  },
  NOT_SUPPORTED: {
    label: '不支持预览',
    value: 2,
    type: 'info',
  },
  FAILED: {
    label: '转换失败',
    value: 3,
    type: 'danger',
  },
  DOWNLOAD_ONLY: {
    label: '仅支持下载',
    value: 4,
    type: 'info',
  },
}

/**
 * 预览来源
 */
export const filePreviewSourceEnum: DictEnum<FilePreviewSource, 'ORIGINAL' | 'CONVERT'> = {
  ORIGINAL: {
    label: '原文件',
    value: 'original',
    type: 'primary',
  },
  CONVERT: {
    label: '转换产物',
    value: 'convert',
    type: 'success',
  },
}

/**
 * 文件访问范围
 */
export const fileAccessScopeEnum: DictEnum<FileAccessScope, 'PRIVATE' | 'PUBLIC'> = {
  PRIVATE: {
    label: '私有',
    value: 'private',
    type: 'info',
  },
  PUBLIC: {
    label: '公开',
    value: 'public',
    type: 'success',
  },
}

/**
 * 水印等级
 */
export const fileWatermarkLevelEnum: DictEnum<FileWatermarkLevel, 'OFF' | 'L1' | 'L2'> = {
  OFF: {
    label: '无水印',
    value: 'off',
    type: 'info',
  },
  L1: {
    label: '前端水印',
    value: 'l1',
    type: 'warning',
  },
  L2: {
    label: '服务端水印',
    value: 'l2',
    type: 'success',
  },
}

/**
 * 图片处理模式
 */
export const fileImageModeEnum: DictEnum<FileImageMode, 'ORIGINAL' | 'WEBP' | 'PDF'> = {
  ORIGINAL: {
    label: '原图',
    value: 'original',
    type: 'info',
  },
  WEBP: {
    label: 'WebP',
    value: 'webp',
    type: 'success',
  },
  PDF: {
    label: 'PDF',
    value: 'pdf',
    type: 'danger',
  },
}

/**
 * 分享方式
 */
export const fileShareModeEnum: DictEnum<FileShareMode, 'LINK' | 'USER'> = {
  LINK: {
    label: '链接分享',
    value: 'LINK',
    type: 'primary',
  },
  USER: {
    label: '指定用户',
    value: 'USER',
    type: 'success',
  },
}

/**
 * 分享权限
 */
export const fileSharePermissionEnum: DictEnum<FileSharePermission, 'VIEW' | 'VIEW_DOWNLOAD' | 'DOWNLOAD'> = {
  VIEW: {
    label: '仅查看',
    value: 'VIEW',
    type: 'info',
  },
  VIEW_DOWNLOAD: {
    label: '查看+下载',
    value: 'VIEW_DOWNLOAD',
    type: 'primary',
  },
  DOWNLOAD: {
    label: '仅下载',
    value: 'DOWNLOAD',
    type: 'warning',
  },
}

/**
 * 分享状态
 *
 * 1 正常 / 0 已撤销 / 2 已失效
 */
export const fileShareStatusEnum: DictEnum<FileShareStatus, 'NORMAL' | 'REVOKED' | 'INVALID'> = {
  NORMAL: {
    label: '正常',
    value: 1,
    type: 'success',
  },
  REVOKED: {
    label: '已撤销',
    value: 0,
    type: 'info',
  },
  INVALID: {
    label: '已失效',
    value: 2,
    type: 'danger',
  },
}

/**
 * 文件存储类型
 */
export const fileStorageTypeEnum: DictEnum<string, FileStorageType> = {
  LOCAL: {
    label: '本地存储',
    value: 'LOCAL',
    type: 'info',
  },
  MINIO: {
    label: 'MinIO存储',
    value: 'MINIO',
    type: 'primary',
  },
  S3: {
    label: 'S3存储',
    value: 'S3',
    type: 'success',
  },
  OSS: {
    label: 'OSS存储',
    value: 'OSS',
    type: 'warning',
  },
  DATABASE: {
    label: '数据库存储',
    value: 'DATABASE',
    type: 'danger',
  },
}
