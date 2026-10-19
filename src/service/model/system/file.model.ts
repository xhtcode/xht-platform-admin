/**
 * 文件状态
 */
export type FileStatus = 1 | 2 | 99

/**
 * 系统管理-文件查询请求参数类型
 */
export interface SysFileQueryRequest extends PageQueryRequest {
  fileSuffix?: string // 文件后缀（精确查询）
  fileStorageKey?: string // 文件存储key
}

/**
 * 系统管理-文件响应类型
 */
export interface SysFileResponse extends MetaResponse {
  id: ModeIdType // 文件ID
  fileOriginalName: string // 文件原始名称
  fileSize: number // 文件大小（单位：字节）
  fileSizeInfo: string // 文件大小信息
  fileHash: string // 文件hash
  fileType: string // 文件类型
  fileSuffix: string // 文件后缀
  fileStatus: FileStatus // 文件状态
  fileUsed: string // 文件用途
  fileStorageType: string // 文件存储类型
  fileStorageName: string // 文件存储名称
  fileStorageKey: string // 文件存储key
  fileStoragePath: string // 文件存储路径
  filePreviewUrl: string // 文件预览地址
  fileMetadata: Record<string, any> // 文件元数据（JSON 字符串）
  fileUploadTime: string // 文件上传时间
  fileUploadUser: string // 文件上传用户
}

/**
 * 系统管理-文件上传请求参数类型
 */
export interface SysFileOperationRequest {
  fileUsed?: string // 文件用途
}
