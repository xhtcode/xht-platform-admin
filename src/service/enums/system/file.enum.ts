import type { FileStatus } from '@/service/model/system/file.model'

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
 * 文件存储类型
 */
export const fileStorageTypeEnum: DictEnum<string, 'LOCAL' | 'MINIO' | 'S3' | 'OSS' | 'DATABASE'> = {
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
