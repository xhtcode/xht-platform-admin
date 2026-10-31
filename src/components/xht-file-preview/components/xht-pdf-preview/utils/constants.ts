/**
 * 缩放范围限制（对齐 pdf.js 官方档位上限 400%）
 */
export const MIN_SCALE = 0.25
export const MAX_SCALE = 4
export const DEFAULT_SCALE = 1

/**
 * pdf.js 官方渲染换算系数：1 PDF 单位 = 96/72 CSS px。
 * 官方 viewer 渲染与适配计算全程乘此系数（PixelsPerInch.PDF_TO_CSS_UNITS），
 * 缺了它同档位会比官方小 25%——「实际大小」尤其实感明显。
 */
export const PDF_TO_CSS_UNITS = 96 / 72

/**
 * 内容区内边距与页间距（px），需与样式保持一致，用于页码定位计算
 */
export const CONTENT_PADDING = 12
export const PAGE_GAP = 12

/**
 * 渲染清晰度上限：位图总放大倍数（scale × devicePixelRatio）不超过该值，平衡清晰度与内存
 */
export const MAX_PIXEL_RATIO = 2.5

/**
 * 可视区外保留的已渲染页数：超出范围的页面会被卸载，避免长文档内存膨胀
 */
export const KEEP_PAGES = 2

/**
 * 打印渲染倍率：越大越清晰，同时更占内存
 */
export const PRINT_SCALE = 1.6

/**
 * Range 分段拉取的单块字节数：过小会产生大量请求，过大则首屏等待变久
 */
export const PDF_RANGE_CHUNK_SIZE = 256 * 1024

/**
 * 侧栏宽度（px）：默认值与拖拽范围
 */
export const SIDEBAR_MIN_WIDTH = 160
export const SIDEBAR_MAX_WIDTH = 560
export const SIDEBAR_WIDTH = 296

/**
 * 缩放百分比菜单项（%），对齐 pdf.js 官方档位
 */
export const ZOOM_PERCENTS = [50, 75, 100, 125, 150, 200, 300, 400]

/**
 * pdf.js 官方 auto 上限：自动缩放最大只放大到 125%（超过部分由用户手动指定）
 */
export const MAX_AUTO_SCALE = 1.25

/**
 * 标题定位时顶部预留的空隙（scale=1 时的 px），避免章节标题紧贴视口上沿
 */
export const TITLE_TOP_MARGIN = 8

/**
 * 命中行滚动定位时顶部预留空间：避免命中行贴视口顶端、被搜索栏遮挡
 */
export const SEARCH_SCROLL_MARGIN = 110

/**
 * 打印窗口占位内容：生成打印图片期间展示，避免用户看到空白窗口
 */
// 独立打印窗口 HTML，不参与暗黑模式，故不使用变量（color:#606266）
export const PREPARING_HTML = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8" /><title>正在准备打印</title></head><body style="display:flex;height:100vh;margin:0;align-items:center;justify-content:center;font:14px/1.6 sans-serif;color:#606266">正在准备打印内容，请稍候…</body></html>`

/**
 * HTML 转义映射：打印窗口标题来自文件名，需转义后写入
 */
export const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/**
 * 快捷键清单（与组件实际实现保持一致）
 */
export const SHORTCUT_ITEMS = [
  { keys: ['Ctrl', 'F'], label: '打开搜索（macOS 为 ⌘F）' },
  { keys: ['Enter'], label: '搜索：新关键词定位首个命中；未变更时跳到下一个' },
  { keys: ['Shift', 'Enter'], label: '搜索上一个命中' },
  { keys: ['Esc'], label: '关闭搜索' },
]
