/**
 * 文件状态
 */
export type FileStatus = 1 | 2 | 99
/**
 * 文件存储类型
 */
export type FileStorageType = 'LOCAL' | 'MINIO'
/**
 * 文件预览类型
 *
 * 与后端 `PreviewTypeEnum` 编码一致，由服务端按文件后缀匹配文件类型配置判定；
 * 未匹配到配置的文件该字段为空，前端需自行兜底。
 */
export type FilePreviewType = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 预览初始化状态
 *
 * 0 成功 / 1 转换中 / 2 不支持预览 / 3 转换失败 / 4 仅下载
 */
export type FileInitStatus = 0 | 1 | 2 | 3 | 4

/**
 * 预览来源
 */
export type FilePreviewSource = 'original' | 'convert'

/**
 * 文件访问范围
 */
export type FileAccessScope = 'private' | 'public'

/**
 * 水印等级
 */
export type FileWatermarkLevel = 'off' | 'l1' | 'l2'

/**
 * 图片处理模式
 */
export type FileImageMode = 'original' | 'webp' | 'pdf'

/**
 * 转换状态
 */
export type FileConversionStatus = 'NONE' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'

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
  fileSize: string // 文件大小（单位：字节；后端 Long 统一序列化为字符串）
  fileSizeInfo: string // 文件大小信息
  fileHash: string // 文件hash
  fileType: string // 文件类型（MIME）
  fileSuffix: string // 文件后缀
  filePreviewType?: FilePreviewType | null // 文件预览类型（服务端按后缀判定，未匹配到文件类型配置时为空）
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
 * 系统管理-文件能力清单
 */
export interface SysFileCapabilities {
  preview: boolean // 允许预览
  download: boolean // 允许下载
  print: boolean // 允许打印
  share: boolean // 允许分享
}

/**
 * 系统管理-文件转换状态
 */
export interface SysFileConversion {
  required: boolean // 是否需要转换
  status: FileConversionStatus // 转换状态
  progress: number | null // 粗粒度进度：0/50/100
  message: string | null // 提示信息
  retryAfterMs: number | null // 建议重试间隔（毫秒）
}

/**
 * 系统管理-文件水印信息
 */
export interface SysFileWatermark {
  enabled: boolean // 是否启用水印
  level: FileWatermarkLevel // 水印等级：off/l1/l2
  text: string | null // 水印文案
  opacity: number // 前端水印透明度
}

/**
 * 系统管理-文件预览访问地址
 */
export interface SysFilePreviewUrls {
  previewUrl: string // 预览内容地址
  downloadUrl: string // 下载地址
  statusUrl: string // 状态查询地址
}

/**
 * 系统管理-文件预览初始化请求参数
 *
 * 对应接口：POST /sys/files/preview/init（fileId 与 fileStorageKey 二选一，优先 fileId）
 */
export interface SysFilePreviewInitRequest {
  fileId?: string // 文件ID
  fileStorageKey?: string // 文件存储Key
  shareTicket?: string // 分享访问票据
}

/**
 * 系统管理-文件预览初始化响应类型（SysFilePreviewResponse）
 */
export interface SysFilePreviewInitResponse {
  previewId: string // 预览ID
  initStatus: FileInitStatus // 初始化状态
  fileName: string // 文件完整原始名称（含后缀）
  fileOriginalName: string // 文件完整原始名称（含后缀）
  fileSize: string // 文件大小（单位：字节；后端 Long 统一序列化为字符串）
  fileSizeInfo: string // 文件大小信息
  fileSuffix: string // 文件后缀
  fileType: string // 文件 MIME 类型
  accessScope: FileAccessScope // 访问范围
  previewMode: FilePreviewType // 预览模式
  previewSource: FilePreviewSource // 预览来源
  capabilities: SysFileCapabilities // 能力清单
  conversion: SysFileConversion // 转换状态
  watermark: SysFileWatermark // 水印信息
  urls: SysFilePreviewUrls // 访问地址
  expireAt: string // 会话过期时间（yyyy-MM-dd HH:mm:ss）
}

/**
 * 系统管理-文件预览状态响应类型（SysFilePreviewStatusResponse）
 */
export interface SysFilePreviewStatusResponse {
  previewId: string // 预览ID
  initStatus: FileInitStatus // 初始化状态
  previewMode: FilePreviewType // 预览模式
  previewSource: FilePreviewSource // 预览来源
  capabilities: SysFileCapabilities // 能力清单
  conversion: SysFileConversion // 转换状态
  watermark: SysFileWatermark // 水印信息
  expireAt: string // 会话过期时间
}

/**
 * 系统管理-文本预览分页数据
 *
 * 后端按字节分页读取：`offset` 为本页结束位置，也是下一页的起始游标。
 */
export interface TextPreviewChunk {
  content: string // 本页文本内容
  offset: number // 下一页游标（本页结束字节位置）
  current: number // 当前页码（从 1 开始）
  size: number // 单页字节数
  pages: number // 总页数（按 total / size 估算）
  total: number // 文件总字节数
  hasMore: boolean // 是否还有下一页
  charset?: string // 本次使用的文本编码
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
