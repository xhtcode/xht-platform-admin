import { editor } from 'monaco-editor'
import ISuggestOptions = editor.ISuggestOptions

/**
 * 配置编辑器提示配置
 */
const customSuggestOptions: ISuggestOptions = {
  // 核心行为配置
  insertMode: 'replace', // 选中建议时替换当前单词
  filterGraceful: true, // 启用宽松匹配，提升建议容错性
  localityBonus: true, // 优先推荐上下文附近的单词
  matchOnWordStartOnly: false, // 允许匹配单词中间内容

  // UI 显示配置
  showIcons: true, // 显示建议图标
  preview: true, // 启用建议预览
  previewMode: 'subwordSmart', // 智能子单词预览
  showInlineDetails: true, // 内联显示函数参数等详情

  // 建议类型过滤
  showDeprecated: false, // 隐藏已废弃的建议项
  showSnippets: true, // 显示代码片段建议
  showKeywords: true, // 显示语言关键字建议
  showFiles: true, // 隐藏文件路径建议（如无需路径补全场景）
}
export { customSuggestOptions }
