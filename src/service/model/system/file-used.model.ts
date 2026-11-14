/**
 * 系统管理-文件用途启用状态
 */
export type FileUsedEnabled = 1 | 0

/**
 * 系统管理-文件用途分页查询参数（SysFileUsedQuery）
 *
 * 未传参的字段不参与过滤；服务端固定按 usedSort、id 升序返回。
 */
export interface SysFileUsedQueryRequest extends PageQueryRequest {
  usedCode?: string // 用途编码（模糊）
  usedName?: string // 用途名称（模糊）
  usedEnabled?: FileUsedEnabled // 启用状态：1 启用 / 0 停用（精确）
}

/**
 * 系统管理-文件用途配置响应类型（SysFileUsedResponse）
 *
 * 该配置同时被「用途管理页」与「上传页下拉」复用。
 */
export interface SysFileUsedResponse extends MetaResponse {
  id: ModeIdType // 主键ID
  usedCode: string // 用途编码（创建后不可改）
  usedName: string // 用途名称
  usedDesc?: string | null // 说明
  usedEnabled: FileUsedEnabled // 是否启用：1 启用 0 停用
  usedSort: number // 排序
}

/**
 * 系统管理-文件用途配置新增/修改入参（SysFileUsedForm）
 */
export interface SysFileUsedOperationRequest extends Partial<SysFileUsedResponse>, BasicFormRequest {}
