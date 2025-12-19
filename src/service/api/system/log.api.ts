import request from '@/utils/request'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

export function saveLog(data: any) {
  return request({
    url: '/sys/log/save',
    baseURL,
    method: 'post',
    data: data,
  })
}
