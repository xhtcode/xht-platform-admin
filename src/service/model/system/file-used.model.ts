import type { FileAccessScope, FileImageMode, FileWatermarkLevel } from '@/service/model/system/file.model'

/**
 * 系统管理-文件用途配置响应类型（SysFileUsedResponse）
 *
 * 用途是文件策略的第一层：上传时选定用途后，该文件的可下载/可打印/可分享/水印等级
 * 全部由用途配置决定，因此该配置同时被「用途管理页」与「上传页下拉」复用。
 */
export interface SysFileUsedResponse {
  id: ModeIdType // 主键ID
  usedCode: string // 用途编码（创建后不可改）
  usedName: string // 用途名称
  description?: string | null // 说明
  builtIn: number // 是否内置：1 内置（不允许删除）
  enabled: number // 是否启用：1 启用 0 停用
  sort: number // 排序
  accessScope: FileAccessScope // 默认访问范围
  publicAllowed: number // 是否允许设为 public：1 允许 0 不允许
  downloadAllowed: number // 下载闸门：1 允许 0 禁止
  printAllowed: number // 打印闸门：1 允许 0 禁止
  shareAllowed: number // 分享闸门：1 允许 0 禁止
  shareExpireDays?: number | null // 默认分享天数（空则继承全局）
  shareMaxAccessCount?: number | null // 分享访问次数上限（空则继承全局）
  watermarkLevel: FileWatermarkLevel // 水印等级
  imageMode?: FileImageMode | null // 图片处理模式（空则继承全局）
  fileCount: string // 引用文件数（后端 Long 统一序列化为字符串）
  updateTime?: string | null // 更新时间
}

/**
 * 系统管理-文件用途配置新增/修改入参（SysFileUsedForm）
 *
 * 注意：更新时 `usedCode` 不可修改，后端以路径上的 id 为准。
 */
export interface SysFileUsedOperationRequest {
  usedCode: string // 用途编码，^[a-z][a-z0-9_]{1,31}$
  usedName: string // 用途名称
  description?: string | null // 说明
  enabled: number // 是否启用：1 启用 0 停用
  sort: number // 排序
  accessScope: FileAccessScope // 默认访问范围
  publicAllowed: number // 是否允许设为公开
  downloadAllowed: number // 下载闸门
  printAllowed: number // 打印闸门
  shareAllowed: number // 分享闸门
  shareExpireDays?: number | null // 默认分享天数
  shareMaxAccessCount?: number | null // 分享访问次数上限
  watermarkLevel: FileWatermarkLevel // 水印等级
  imageMode?: FileImageMode | null // 图片处理模式
}
