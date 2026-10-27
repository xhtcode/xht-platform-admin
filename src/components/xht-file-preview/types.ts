/**
 * 文件预览模式
 */
export type XhtFilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 文件预览入参（`show()` 方法参数）
 *
 * 与具体业务响应结构解耦，业务行数据（如 SysFileResponse）结构兼容即可直接传入。
 */
export interface XhtFilePreviewFile {
  fileStorageKey: string // 文件存储key（预览/下载接口使用）
  fileOriginalName?: string // 文件原始名称（弹窗标题）
  fileType?: string // 文件类型（MIME）
  fileSuffix?: string // 文件后缀
}
