/**
 * 分享方式：LINK 链接分享 / USER 指定用户分享
 */
export type FileShareMode = 'LINK' | 'USER'

/**
 * 分享权限：VIEW 仅查看 / VIEW_DOWNLOAD 查看+下载 / DOWNLOAD 仅下载
 */
export type FileSharePermission = 'VIEW' | 'VIEW_DOWNLOAD' | 'DOWNLOAD'

/**
 * 分享状态：1 正常 / 0 已撤销 / 2 已失效
 */
export type FileShareStatus = 0 | 1 | 2

/**
 * 接收人类型：USER 用户 / DEPT 部门 / ROLE 角色
 */
export type FileShareReceiverType = 'USER' | 'DEPT' | 'ROLE'

/**
 * 系统管理-创建文件分享请求参数
 *
 * 对应接口：POST /sys/files/preview/share
 */
export interface SysFileShareCreateRequest {
  previewId: string // 预览ID
  shareMode: FileShareMode // 分享方式
  permission: FileSharePermission // 分享权限
  expireDays?: number // 有效期天数（不传取用途/全局默认，超上限由服务端收敛）
  requireCode?: boolean // 是否需要提取码
  accessCode?: string // 自定义提取码；requireCode=true 且为空时服务端随机生成
  maxAccessCount?: number // 访问次数上限，仅 LINK 生效，0=不限
  receiverType?: FileShareReceiverType // 接收人类型
  receiverIds?: string[] // 接收人ID集合
  needNotice?: boolean // 是否发送站内信（当前版本不生效）
}

/**
 * 系统管理-文件分享信息（FileShareResponse）
 */
export interface SysFileShareResponse {
  shareId: string // 分享ID
  shareMode: FileShareMode // 分享方式
  permission: FileSharePermission // 分享权限
  requireCode: boolean // 是否需要提取码
  shareToken?: string | null // 分享定位串，仅 LINK 返回
  shareUrl?: string | null // 分享链接，仅 LINK 返回
  accessCode?: string | null // 提取码明文，仅创建时返回一次
  expireAt: string // 过期时间
  maxAccessCount: number // 访问次数上限
  accessCount: number // 访问次数
  receiverCount: number // 接收人数
  status: FileShareStatus // 状态
  fileName: string // 文件名
  fileSizeInfo: string // 文件大小信息
  fileSuffix: string // 文件后缀
  createTime: string // 创建时间
}

/**
 * 系统管理-分享元信息（FileShareMetaResponse）
 */
export interface SysFileShareMetaResponse {
  shareId: string // 分享ID
  shareMode: FileShareMode // 分享方式
  fileName: string // 文件名
  fileSizeInfo: string // 文件大小信息
  fileSuffix: string // 文件后缀
  creatorName: string // 分享人
  permission: FileSharePermission // 分享权限
  requireCode: boolean // 是否需要提取码
  expireAt: string // 过期时间
  status: FileShareStatus // 状态
}

/**
 * 系统管理-打开分享响应（FileShareOpenResponse）
 */
export interface SysFileShareOpenResponse {
  shareTicket: string // 分享票据
  shareId: string // 分享ID
  permission: FileSharePermission // 分享权限
  requireCode: boolean // 是否需要提取码
  expireAt: string // 票据过期时间
}

/**
 * 系统管理-分享给我的记录（FileShareReceivedResponse）
 */
export interface SysFileShareReceivedResponse {
  receiverId: string // 接收人记录ID
  shareId: string // 分享ID
  fileName: string // 文件名
  fileSizeInfo: string // 文件大小信息
  fileSuffix: string // 文件后缀
  creatorName: string // 分享人
  permission: FileSharePermission // 分享权限
  readStatus: 0 | 1 // 已读状态：0未读 1已读
  firstViewTime: string | null // 首次查看时间
  expireAt: string // 过期时间
  status: FileShareStatus // 分享状态
}

/**
 * 系统管理-分享接收人（FileShareReceiverResponse）
 */
export interface SysFileShareReceiverResponse {
  receiverId: string // 接收人记录ID
  userId: string // 用户ID
  userName: string // 用户名称
  readStatus: 0 | 1 // 已读状态
  readTime: string | null // 读取时间
  firstViewTime: string | null // 首次查看时间
  downloadCount: number // 下载次数
}

/**
 * 系统管理-我创建的分享分页查询参数
 *
 * 对应接口：POST /sys/files/share/page
 */
export interface SysFileShareQueryRequest extends PageQueryRequest {
  shareMode?: FileShareMode // 分享方式
  permission?: FileSharePermission // 分享权限
  status?: FileShareStatus // 状态
  startTime?: string // 创建时间起（yyyy-MM-dd HH:mm:ss）
  endTime?: string // 创建时间止（yyyy-MM-dd HH:mm:ss）
}

/**
 * 系统管理-分享给我的分页查询参数
 *
 * 对应接口：POST /sys/files/share/received/page
 */
export interface SysFileShareReceivedQueryRequest extends PageQueryRequest {
  readStatus?: 0 | 1 // 已读状态
  includeInvalid?: boolean // 是否包含已过期/已失效
}
