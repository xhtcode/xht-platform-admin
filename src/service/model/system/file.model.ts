/**
 * 文件状态
 */
export type FileStatus = 1 | 2 | 99
/**
 * 文件存储类型
 */
export type FileStorageType = 'LOCAL' | 'MINIO' | 'S3' | 'OSS' | 'DATABASE'

/**
 * 系统管理-文件查询请求参数类型
 *
 * 对应接口：POST /sys/files/page（动态条件过滤，未传参的字段不参与过滤）
 */
export interface SysFileQueryRequest extends PageQueryRequest {
  fileSuffix?: string // 文件后缀（精确）
  fileStorageKey?: string // 文件存储key
  fileType?: string // MIME类型（精确）
  fileStatus?: FileStatus // 文件状态：1已上传、2已关联业务、99已删除
  fileUsed?: string // 文件用途
  fileUploadUser?: string // 上传用户
  startUploadTime?: string // 上传时间范围起（含），yyyy-MM-dd HH:mm:ss
  endUploadTime?: string // 上传时间范围止（含），yyyy-MM-dd HH:mm:ss
}

/**
 * 系统管理-文件响应类型（SysFileResponse）
 */
export interface SysFileResponse {
  id: ModeIdType // 文件ID
  fileOriginalName: string // 文件原始名称
  fileDesc?: string // 文件描述
  fileSize: number // 文件大小（单位：字节）
  fileSizeInfo: string // 文件大小信息
  fileHash: string // 文件hash
  fileType: string // 文件类型（MIME）
  fileSuffix: string // 文件后缀
  fileStatus: FileStatus // 文件状态
  fileUsed?: string // 文件用途
  fileStorageType: string // 文件存储类型
  fileStorageName: string // 文件存储名称
  fileStorageKey: string // 文件存储key
  fileStoragePath: string // 文件存储路径
  fileMetadata?: Record<string, any> // 文件元数据（含完整原始文件名等）
  fileUploadTime: string // 文件上传时间
  fileUploadUser: string // 文件上传用户
  fileAssociateTime?: string // 关联业务时间（未关联为null）
}

/**
 * 系统管理-文件预览初始化响应类型（SysFilePreviewResponse）
 *
 * 对应接口：POST /sys/files/preview/init（入参仅 fileStorageKey，服务端在此完成权限校验）
 */
export interface SysFilePreviewResponse {
  fullOriginalFilename: string // 文件完整原始名称（含后缀，不受入库截断影响）
  fileSize: number // 文件大小（单位：字节）
  fileSizeInfo: string // 文件大小信息
  fileType: string // 文件类型（MIME）
  fileSuffix: string // 文件后缀（小写）
  fileStorageName: string // 物理存储名（存储key + 后缀）
  previewUrl: string // 预览地址（相对服务根路径，支持 Range）
  downloadUrl: string // 下载地址（相对服务根路径）
}

/**
 * 系统管理-文件上传请求参数类型
 *
 * 对应接口：POST /sys/files/upload（form-data：file + fileUsed）
 */
export interface SysFileOperationRequest {
  fileUsed?: string // 文件用途
}

/**
 * 系统管理-分片合并请求参数类型
 *
 * 对应接口：POST /sys/files/chunk/merge（form：uploadId + fileName + chunkTotal + fileUsed + fileDesc + fileHash）
 */
export interface SysFileChunkMergeRequest {
  uploadId: string // 分片上传标识，与分片上传时保持一致
  fileName: string // 原始文件名（含后缀）
  chunkTotal: number // 分片总数，大于0
  fileUsed?: string // 文件用途标识
  fileDesc?: string // 文件描述
  fileHash?: string // 文件整体MD5，用于合并后完整性校验
}
