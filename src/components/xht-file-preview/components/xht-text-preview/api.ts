import { requestRaw } from '@/utils/request'
import { BusinessError } from '@/utils/business-error'
import type { TextPreviewPage, TextPreviewQuery } from '@/components/xht-file-preview/components/xht-text-preview/types'

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
 * 失败响应（统一 R 结构）
 *
 * 该接口成功时返回裸对象（无 code），失败时返回 R 结构且 HTTP 状态仍为 200，
 * 因此只能按响应体是否带 code 判定成败，不能依赖 HTTP 状态码。
 */
interface PreviewFailureBody {
  code?: number
  msg?: string
}

/**
 * 分页读取文本文件内容
 *
 * 该接口没有统一业务信封，故走 `requestRaw`；又因失败体同样以 HTTP 200 返回，
 * 拦截器会按成功放行，这里必须自行识别并抛出，否则调用方会把错误体当成内容渲染。
 * 按项目约定 api 层不弹提示：错误文案随 `BusinessError.message` 交给调用方内联展示。
 *
 * @param query 预览参数（续读时原样回传上一页的 offset）
 * @returns 文本分页数据
 */
export const previewTextFile = async (query: TextPreviewQuery): Promise<TextPreviewPage> => {
  const { fileStorageKey, offset, size, charset, signal } = query
  const body = await requestRaw<TextPreviewPage & PreviewFailureBody>({
    url: Api.PREVIEW,
    baseURL,
    method: 'get',
    // 值为 undefined 的参数由 axios 自动丢弃，无需手工拼接查询串
    params: { fileStorageKey, offset, size, charset },
    signal,
  })
  if (typeof body?.code === 'number') {
    throw new BusinessError(body.code, body.msg ?? '')
  }
  return body
}
