import request from '@/utils/request'
import type { ApiResponse } from 'axios'
import type { SysFileSettingResponse, SysFileSettingUpdateItem } from '@/service/model/system/file-setting.model'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 接口地址
 *
 * 使用常量对象而非 enum：查询与保存共用同一地址（仅方法不同），enum 成员值重复会被 lint 判为错误。
 */
const Api = {
  SETTINGS: '/sys/files/settings',
  RESET: '/sys/files/settings/reset',
} as const

/**
 * 按分组查询文件全局配置（不传 group 返回全部）
 *
 * @param group 配置分组：download/print/share/watermark/convert/session/image/file
 */
export const querySysFileSettingList = (group?: string): Promise<ApiResponse<SysFileSettingResponse[]>> => {
  return request<SysFileSettingResponse[]>({
    url: Api.SETTINGS,
    baseURL,
    method: 'get',
    params: { group },
  })
}

/**
 * 批量保存文件全局配置
 *
 * `version` 为乐观锁版本号，必须与查询时一致，否则后端拒绝本次保存。
 *
 * @param items 待保存的配置项
 */
export const updateSysFileSetting = (items: SysFileSettingUpdateItem[]): Promise<ApiResponse<number>> => {
  return request<number>({
    url: Api.SETTINGS,
    baseURL,
    method: 'put',
    data: { items },
  })
}

/**
 * 恢复默认配置
 *
 * @param keys 需要恢复默认的配置键集合
 */
export const resetSysFileSetting = (keys: string[]): Promise<ApiResponse<number>> => {
  return request<number>({
    url: Api.RESET,
    baseURL,
    method: 'post',
    data: keys,
  })
}
