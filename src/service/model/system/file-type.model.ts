import type { FilePreviewType } from '@/service/model/system/file.model'

/**
 * 系统管理-文件预览类型配置查询请求参数类型
 *
 * 对应接口：POST /sys/files/type/page（未传字段不参与过滤，结果默认按 id 升序）
 */
export interface SysFileTypeQueryRequest extends PageQueryRequest {
  previewType?: FilePreviewType // 预览类型编码（精确）
  previewName?: string // 预览类型名称（模糊）
  fileSuffix?: string // 文件后缀（精确）
}

/**
 * 系统管理-文件预览类型配置响应类型（SysFileTypeResponse）
 */
export interface SysFileTypeResponse extends MetaResponse {
  id: ModeIdType // 配置ID
  previewType: FilePreviewType // 预览类型编码
  previewName: string // 预览类型名称
  fileSuffix?: string | null // 文件后缀；为 null 表示该预览类型的默认名称配置
}

/**
 * 系统管理-文件预览类型配置组合视图对象
 */
export interface SysFileTypeVo extends Partial<SysFileTypeResponse> {}

/**
 * 系统管理-文件预览类型配置新增/修改入参（SysFileTypeForm）
 *
 * 注意：不配置后缀时请传 null 或省略字段，不要传空字符串——
 * 空串会入库为 ''，服务层唯一校验会跳过它，后续再创建空串配置将命中数据库唯一索引。
 */
export interface SysFileTypeOperationRequest extends SysFileTypeVo, BasicFormRequest {}
