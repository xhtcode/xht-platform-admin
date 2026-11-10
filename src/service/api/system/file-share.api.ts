import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type {
  SysFileShareCreateRequest,
  SysFileShareMetaResponse,
  SysFileShareOpenResponse,
  SysFileShareQueryRequest,
  SysFileShareReceivedQueryRequest,
  SysFileShareReceivedResponse,
  SysFileShareReceiverResponse,
  SysFileShareResponse,
} from '@/service/model/system/file-share.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 接口地址
 *
 * 使用常量对象而非 enum：多个接口共享同一段前缀（如 `/sys/files/share/{shareId}` 下的
 * 撤销 / 重置提取码 / 已读 / 隐藏），enum 成员值重复会被 lint 判为错误。
 */
const Api = {
  CREATE: '/sys/files/preview/share',
  LINK_META: '/sys/files/share/link/',
  LINK_OPEN: '/sys/files/share/link/',
  USER_META: '/sys/files/share/user/',
  USER_OPEN: '/sys/files/share/user/',
  PAGE: '/sys/files/share/page',
  RECEIVED_PAGE: '/sys/files/share/received/page',
  RECEIVED_UNREAD: '/sys/files/share/received/unread-count',
  /** 分享维度的公共前缀：接收人 / 撤销 / 重置提取码 / 已读 / 隐藏 */
  SHARE: '/sys/files/share/',
} as const

/**
 * 创建文件分享
 *
 * 需登录，且预览初始化返回的 `capabilities.share === true`（匿名、公开文件、分享来访者均为 false）。
 * 提取码明文只在本次响应返回一次，关闭后无法再查。
 *
 * @param data 创建分享请求参数
 */
export const createSysFileShare = (data: SysFileShareCreateRequest): Promise<ApiResponse<SysFileShareResponse>> => {
  return request<SysFileShareResponse>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data,
  })
}

/**
 * 查询链接分享元信息（匿名可访问）
 *
 * @param token 分享定位串
 */
export const queryLinkShareMeta = (token: string): Promise<ApiResponse<SysFileShareMetaResponse>> => {
  return request<SysFileShareMetaResponse>({
    url: Api.LINK_META + `${token}/meta`,
    baseURL,
    method: 'get',
  })
}

/**
 * 打开链接分享（匿名可访问，提取码校验合并在此接口）
 *
 * @param token 分享定位串
 * @param accessCode 提取码（`requireCode === false` 时可不传）
 */
export const openLinkShare = (token: string, accessCode?: string): Promise<ApiResponse<SysFileShareOpenResponse>> => {
  return request<SysFileShareOpenResponse>({
    url: Api.LINK_OPEN + `${token}/open`,
    baseURL,
    method: 'post',
    data: { accessCode },
  })
}

/**
 * 查询指定用户分享元信息（需登录且是接收人）
 *
 * @param shareId 分享ID
 */
export const queryUserShareMeta = (shareId: ModeIdType): Promise<ApiResponse<SysFileShareMetaResponse>> => {
  return request<SysFileShareMetaResponse>({
    url: Api.USER_META + `${shareId}/meta`,
    baseURL,
    method: 'get',
  })
}

/**
 * 打开指定用户分享（需登录，成功后自动置为已读并记录首次查看时间）
 *
 * @param shareId 分享ID
 * @param accessCode 提取码
 */
export const openUserShare = (shareId: ModeIdType, accessCode?: string): Promise<ApiResponse<SysFileShareOpenResponse>> => {
  return request<SysFileShareOpenResponse>({
    url: Api.USER_OPEN + `${shareId}/open`,
    baseURL,
    method: 'post',
    data: { accessCode },
  })
}

/**
 * 分页查询「我分享的」
 *
 * @param query 查询参数
 */
export const querySysFileSharePage = (query?: SysFileShareQueryRequest): Promise<ApiResponse<PageResponse<SysFileShareResponse>>> => {
  return request<PageResponse<SysFileShareResponse>>({
    url: Api.PAGE,
    baseURL,
    method: 'post',
    data: query,
  })
}

/**
 * 分页查询「分享给我的」
 *
 * @param query 查询参数
 */
export const querySysFileShareReceivedPage = (
  query?: SysFileShareReceivedQueryRequest
): Promise<ApiResponse<PageResponse<SysFileShareReceivedResponse>>> => {
  return request<PageResponse<SysFileShareReceivedResponse>>({
    url: Api.RECEIVED_PAGE,
    baseURL,
    method: 'post',
    data: query,
  })
}

/**
 * 查询「分享给我的」未读数量
 *
 * 后端 Long 统一序列化为字符串，展示前需 `Number()` 转换。
 */
export const querySysFileShareReceivedUnreadCount = (): Promise<ApiResponse<string>> => {
  return request<string>({
    url: Api.RECEIVED_UNREAD,
    baseURL,
    method: 'get',
  })
}

/**
 * 查询分享接收人列表（仅指定用户分享）
 *
 * @param shareId 分享ID
 */
export const querySysFileShareReceivers = (shareId: ModeIdType): Promise<ApiResponse<SysFileShareReceiverResponse[]>> => {
  return request<SysFileShareReceiverResponse[]>({
    url: Api.SHARE + `${shareId}/receivers`,
    baseURL,
    method: 'get',
  })
}

/**
 * 撤销分享（撤销后链接立即失效）
 *
 * @param shareId 分享ID
 */
export const revokeSysFileShare = (shareId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.SHARE + `${shareId}`,
    baseURL,
    method: 'delete',
  })
}

/**
 * 重置分享提取码
 *
 * @param shareId 分享ID
 * @param accessCode 自定义提取码（留空由服务端随机生成）
 * @returns 新的提取码明文，只返回一次
 */
export const resetSysFileShareCode = (shareId: ModeIdType, accessCode?: string): Promise<ApiResponse<string>> => {
  return request<string>({
    url: Api.SHARE + `${shareId}/reset-code`,
    baseURL,
    method: 'post',
    params: { accessCode },
  })
}

/**
 * 标记分享已读
 *
 * 打开分享时后端已自动置读，该接口用于「全部已读」等批量场景。
 *
 * @param shareId 分享ID
 */
export const markSysFileShareRead = (shareId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.SHARE + `${shareId}/read`,
    baseURL,
    method: 'post',
  })
}

/**
 * 从「分享给我的」列表移除（只影响列表，不影响链接有效性）
 *
 * @param shareId 分享ID
 */
export const hideSysFileShare = (shareId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.SHARE + `${shareId}/hide`,
    baseURL,
    method: 'post',
  })
}
