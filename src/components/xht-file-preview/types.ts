/**
 * 文件预览模式
 */
export type XhtFilePreviewMode = 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'json' | 'other'

/**
 * 需要独立预览器渲染的模式
 *
 * 音视频由原生 `video` / `audio` 标签直接播放，不需要单独的预览器组件；
 * `other` 走下载型预览器，为无法内联预览的文件提供统一下载入口。
 */
export type XhtFilePreviewRenderMode = 'image' | 'pdf' | 'text' | 'json' | 'other'
