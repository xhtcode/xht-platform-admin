import { requestBlob } from '@/utils/request'
import type { AxiosResponse } from 'axios'

/**
 * 后台管理服务前缀
 */
const baseURL: string = import.meta.env.VITE_ADMIN_API_PREFIX

/**
 * 图片预览接口地址
 *
 * 独立维护：后续后端调整时仅需改此处，不影响其它预览组件。
 */
enum Api {
  PREVIEW = '/sys/files/preview',
}

/**
 * 预览图片文件（拉取图片二进制内容）
 *
 * @param fileStorageKey 文件存储key
 * @param urlParams 浏览地址栏透传参数（后端可能要求携带，如路由查询参数）
 */
export const previewPictureFile = (fileStorageKey: string, urlParams?: Record<string, string>): Promise<AxiosResponse<Blob>> => {
  return requestBlob({
    url: Api.PREVIEW,
    baseURL,
    method: 'get',
    params: { fileStorageKey, ...urlParams },
    responseType: 'blob',
  })
}
