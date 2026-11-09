/**
 * 文件预览模式
 */
export type XhtFilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 需要独立预览器渲染的模式
 *
 * 每种模式对应 `components/` 下一个预览器目录（入口统一 `index.vue`）。
 * 音视频也在其列：内容用浏览器原生 `video` / `audio` 控件播放，但同样收进独立目录，
 * 各自的加载失败提示与样式由预览器自己维护；`other` 是下载型预览器。
 */
export type XhtFilePreviewRenderMode = 'image' | 'pdf' | 'text' | 'json' | 'audio' | 'video' | 'other'
