/**
 * 支持的编辑器语言类型
 * 包括 java, javascript, vue, html 等预定义类型，也支持自定义字符串类型
 */
export type MIRROR_EDITOR_LANGUAGE = 'java' | 'javascript' | 'vue' | 'html' | string

/**
 * 编辑器属性接口
 * 定义了代码编辑器组件的可配置属性
 */
export interface MirrorEditorProps {
  readonly?: boolean // 是否只读
  language?: MIRROR_EDITOR_LANGUAGE // 语言类型
}
