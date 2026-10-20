import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import { NoticeTop, NoticeVo, SysNoticeOperationRequest, SysNoticeQueryRequest, SysNoticeResponse } from '@/service/model/system/notice.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  CREATE = '/sys/notice/create',
  UPDATE = '/sys/notice/update/',
  UPDATE_PUBLISH = '/sys/notice/publish/',
  UPDATE_UNDER_SHELVE = '/sys/notice/underShelve/',
  UPDATE_TOP = '/sys/notice/top/',
  REMOVE = '/sys/notice/remove/',
  QUERY_BY_ID = '/sys/notice/get/',
  QUERY_PAGE = '/sys/notice/page',
}

/**
 * 创建系统管理-通知详情
 *
 * @param form 系统管理-通知详情表单请求参数
 */
export const saveSysNotice = (form: SysNoticeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.CREATE,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据主键`id`更新系统管理-通知详情
 *
 * @param form 系统管理-通知详情表单请求参数
 */
export const updateSysNotice = (form: SysNoticeOperationRequest): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE + `${form.id}`,
    baseURL,
    method: 'post',
    data: form,
  })
}

/**
 * 根据通知id 发布
 *
 * @param noticeId 通知id
 */
export const updateSysNoticePublish = (noticeId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE_PUBLISH + noticeId,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据通知id 下架
 *
 * @param noticeId 通知id
 */
export const updateSysNoticeUnderShelve = (noticeId: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE_UNDER_SHELVE + noticeId,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据通知id 置顶
 *
 * @param noticeId 通知id
 * @param isTop    是否置顶
 */
export const updateSysNoticeTop = (noticeId: ModeIdType, isTop: NoticeTop): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.UPDATE_TOP + `${noticeId}/${isTop}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`删除系统管理-通知详情
 *
 * @param id 系统管理-通知详情主键
 */
export const removeSysNoticeById = (id: ModeIdType): Promise<ApiResponse<void>> => {
  return request<void>({
    url: Api.REMOVE + `${id}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`查询系统管理-通知详情
 *
 * @param id 系统管理-通知详情主键
 */
export const querySysNoticeById = (id: ModeIdType): Promise<ApiResponse<NoticeVo>> => {
  return request<NoticeVo>({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 分页查询系统管理-通知详情
 *
 * @param query 系统管理-通知详情查询请求参数
 */
export const querySysNoticePage = (query?: SysNoticeQueryRequest): Promise<ApiResponse<PageResponse<SysNoticeResponse>>> => {
  return request<PageResponse<SysNoticeResponse>>({
    url: Api.QUERY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
