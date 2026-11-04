import { requestRaw } from '@/utils/request'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 文本预览接口地址
 *
 * 独立维护：后续后端调整时仅需改此处，不影响其它预览组件。
 */
enum Api {
  PREVIEW = '/sys/files/preview',
}

/**
 * 预览文本文件
 *
 * 该接口直接返回文件文本内容（无 code/msg 业务信封），故走 `requestRaw`：
 * 成败仅由 HTTP 状态码判定，失败提示由请求拦截器统一弹出。
 *
 * @param fileStorageKey 文件存储key
 * @returns 文件文本内容
 */
export const previewTextFile = (fileStorageKey: string): Promise<string> => {
  return requestRaw<string>({
    url: Api.PREVIEW,
    baseURL,
    method: 'get',
    params: { fileStorageKey },
  })
}
