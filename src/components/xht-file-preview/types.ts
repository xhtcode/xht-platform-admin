import type { InjectionKey } from 'vue'

/**
 * 文件预览模式
 */
export type XhtFilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 会话重建注入键
 *
 * 预览会话有 TTL，长时间停留后内容请求会返回 50221。
 * 由宿主组件提供重建能力，各预览器在识别到该错误码时调用一次，
 * 宿主重新 init 拿到新的 previewId 后，`key` 变化会让预览器自动重载。
 */
export const FILE_PREVIEW_REFRESH_KEY: InjectionKey<() => Promise<void>> = Symbol('XhtFilePreviewRefresh')

/**
 * 需要独立预览器渲染的模式
 *
 * 每种模式对应 `components/` 下一个预览器目录（入口统一 `index.vue`）。
 * 音视频也在其列：内容用浏览器原生 `video` / `audio` 控件播放，但同样收进独立目录，
 * 各自的加载失败提示与样式由预览器自己维护；`other` 是下载型预览器。
 */
export type XhtFilePreviewRenderMode = 'image' | 'pdf' | 'text' | 'json' | 'audio' | 'video' | 'other'
