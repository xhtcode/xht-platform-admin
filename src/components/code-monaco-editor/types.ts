export type Theme = 'vs' | 'hc-black' | 'vs-dark'

/**
 * 语言类型枚举
 */
export type LanguageType =
  | undefined
  | null
  | string
  // 主流编程语言
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'c'
  | 'c++'
  | 'c#'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'php'
  | 'swift'
  | 'kotlin'
  // 前端相关
  | 'js'
  | 'ts'
  | 'html'
  | 'css'
  | 'scss'
  | 'sass'
  | 'less'
  | 'vue'
  | 'react'
  | 'jsx'
  | 'tsx'
  // 脚本和配置文件
  | 'bash'
  | 'shell'
  | 'powershell'
  | 'json'
  | 'json5'
  | 'yaml'
  | 'yml'
  | 'toml'
  | 'xml'
  | 'ini'
  // 其他常见类型
  | 'txt'
  | 'markdown'
  | 'md'
  | 'sql'
  | 'dart'
  | 'perl'
  | 'lua'
  | 'r'
  | 'matlab'
  | 'scala'
  | 'coffee'
  | 'dockerfile'

/**
 * 编辑器props 属性配置
 */
export interface EditorProps {
  width?: string // 宽度
  height?: string // 高度
  theme?: Theme // 主题
  placeholder?: string
  fontSize?: number // 字体大小
  minimap?: boolean // 是否显示小地图
}
