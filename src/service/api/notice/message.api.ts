import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { MessageStar, MessageTop, SysMessageQueryRequest, SysMessageResponse } from '@/service/model/notice/message.model'
import type { MessageInfoVo, SysMessageInfoResponse } from '@/service/model/notice/message.info.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * api定义
 */
enum Api {
  UPDATE_READ_ALL = '/sys/message/update/read', //  全部已读站内信
  UPDATE_READ = '/sys/message/update/read/', //  已读站内信（收件人侧）
  UPDATE_START = '/sys/message/update/start/', //   收藏站内信（收件人侧）
  UPDATE_TOP = '/sys/message/update/top/', // 置顶站内信（收件人侧）
  UPDATE_REMOVE = '/sys/message/update/remove/', // 删除站内信（收件人侧）
  UPDATE_CANCEL_ALL = '/sys/message/cancel/all/', // 撤回站内信（全部）
  UPDATE_CANCEL_SINGLE = '/sys/message/cancel/single/', // 撤回站内信（对用户单一撤回）
  QUERY_BY_ID = '/sys/message/get/', // 查询站内信详情
  ADMIN_PAGE = '/sys/message/admin/page', // 管理员分页查询站内信
  ADMIN_SEND_PAGE = '/sys/message/admin/send/page', // 管理员分页查看站内信发送详情
  MY_PAGE = '/sys/message/my/page', // 分页查询我接收的站内信
}
/**
 * 全部已读站内信
 */
export const updateMessageReadAll = (): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_READ_ALL,
    baseURL,
    method: 'post',
  })
}
/**
 * 已读站内信（收件人侧）
 */
export const updateMessageRead = (messageId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_READ + `${messageId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 收集站内信（收件人侧）
 */
export const updateMessageStart = (messageId: ModeIdType, start: MessageStar): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_START + `${messageId}/${start}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 置顶站内信（收件人侧）
 */
export const updateMessageTop = (messageId: ModeIdType, top: MessageTop): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_TOP + `${messageId}/${top}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 删除站内信（收件人侧）
 */
export const updateMessageRemove = (messageId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_REMOVE + `${messageId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 撤回站内信（全部）
 */
export const updateCancelAll = (messageId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_CANCEL_ALL + `${messageId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 撤回站内信（对用户单一撤回）
 */
export const updateCancelSingle = (messageId: ModeIdType): AxiosPromise<void> => {
  return request({
    url: Api.UPDATE_CANCEL_SINGLE + `${messageId}`,
    baseURL,
    method: 'post',
  })
}

/**
 * 根据主键`id`查询站内信
 *
 * @param id 站内信主键
 */
export const querySysMessageById = (id: ModeIdType): AxiosPromise<MessageInfoVo> => {
  return request({
    url: Api.QUERY_BY_ID + `${id}`,
    baseURL,
    method: 'get',
  })
}

/**
 * 管理员分页查询站内信
 *
 * @param query 站内信查询请求参数
 */
export const queryAdminPage = (query?: SysMessageQueryRequest): AxiosPromise<PageResponse<SysMessageResponse>> => {
  return request({
    url: Api.ADMIN_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}

/**
 * 管理员分页查看站内信发送详情
 *
 * @param query 站内信查询请求参数
 */
export const queryAdminSendPage = (query?: SysMessageQueryRequest): AxiosPromise<PageResponse<SysMessageInfoResponse>> => {
  return request({
    url: Api.ADMIN_SEND_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}

/**
 * 分页查询我接收的站内信
 *
 * @param query 站内信查询请求参数
 */
export const queryMyMessagePage = (query?: SysMessageQueryRequest): AxiosPromise<PageResponse<MessageInfoVo>> => {
  return request({
    url: Api.MY_PAGE,
    baseURL,
    method: 'get',
    params: query,
  })
}
