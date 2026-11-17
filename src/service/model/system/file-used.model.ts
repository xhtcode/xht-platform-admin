import type { SysFileTypeResponse } from '@/service/model/system/file-type.model'

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

/**
 * 系统管理-文件用途类型授权组合视图（SysFileUsedTypeVO）
 *
 * 对应接口：GET /sys/files/used/type/{usedId}（根据文件使用id查询文件使用类型）
 */
export interface SysFileUsedTypeResponse {
  fileUsed: SysFileUsedResponse // 用途信息
  fileTypeList: SysFileTypeResponse[] // 文件全部类型列表（含详情）
  usedIds: ModeIdType[] // 该用途使用的（已授权）文件类型ID列表
}

/**
 * 系统管理-文件用途类型授权表格行（文件类型 + 分片上传配置）
 *
 * 分片配置优先取查询接口返回值，缺省时由前端填默认值。
 */
export interface SysFileUsedTypeRow extends SysFileTypeResponse {
  supportChunk?: number // 是否支持分片：1 支持 / 0 不支持
  unChunkFileSize?: number | null // 单文件大小（单位字节）：单文件上传的大小上限，支持分片时为单片最大大小
  chunkFileSize?: number | null // 分片大小（单位字节）：分片源文件的最大大小，仅支持分片时生效
}

/**
 * 系统管理-文件用途类型授权入参（SysFileUsedTypeForm）
 *
 * 对应接口：POST /sys/files/used/type/{id}（覆盖式保存，body 为授权类型配置数组，空数组表示清空授权）
 */
export interface SysFileUsedTypeOperationRequest {
  typeId: ModeIdType // 授权的文件类型ID
  supportChunk?: number // 是否支持分片：1 支持 / 0 不支持
  unChunkFileSize?: number | null // 单文件大小（单位字节）：单文件上传的大小上限，支持分片时为单片最大大小
  chunkFileSize?: number | null // 分片大小（单位字节）：分片源文件的最大大小，仅支持分片时生效
}
