import { ref } from 'vue'
import type { Ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PdfCoreContext, PropertyRow } from './types'
import { formatBytes } from './utils'

/**
 * 文档属性模块返回值
 */
export interface PropertiesFeature {
  propertiesVisible: Ref<boolean>
  docProperties: Ref<PropertyRow[]>
  /** 文件总长度（字节），随取流探测时记录 */
  pdfFileSize: Ref<number>
  /** 是否线性化（快速 Web 视图），随取流探测时记录 */
  pdfLinearized: Ref<boolean>
  loadProperties: () => void
}

/**
 * PDF 日期字符串（如 D:20261028164109+08'00'）转本地展示格式
 *
 * @param value 元数据中的日期字符串
 */
const formatPdfDate = (value: unknown): string => {
  const date = typeof value === 'string' ? pdfjsLib.PDFDateString.toDateObject(value) : null
  if (!date || Number.isNaN(date.getTime())) return '—'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}, ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * 页面尺寸标注：毫米尺寸 + 常见纸张型号（A4/Letter 等）与方向
 *
 * @param widthPx  页面宽（CSS px）
 * @param heightPx 页面高（CSS px）
 */
const pageSizeLabel = (widthPx: number, heightPx: number): string => {
  const wMm = Math.round((widthPx * 25.4) / 96)
  const hMm = Math.round((heightPx * 25.4) / 96)
  const w = Math.min(wMm, hMm)
  const h = Math.max(wMm, hMm)
  const presets: Array<[string, number, number]> = [
    ['A3', 297, 420],
    ['A4', 210, 297],
    ['A5', 148, 210],
    ['B5', 176, 250],
    ['Letter', 216, 279],
    ['Legal', 216, 356],
    ['Tabloid', 279, 432],
  ]
  const hit = presets.find(([, pw, ph]) => Math.abs(w - pw) <= 2 && Math.abs(h - ph) <= 2)
  return `${wMm} × ${hMm} 毫米${hit ? `（${hit[0]}，${wMm > hMm ? '横向' : '纵向'}）` : ''}`
}

/**
 * 创建文档属性模块：对齐官方 viewer 的字段与分组（文档信息 / 元数据 / 结构信息）
 *
 * @param ctx         核心上下文
 * @param displayName 展示用文件名
 */
export const createPropertiesFeature = (ctx: PdfCoreContext, displayName: () => string): PropertiesFeature => {
  const { state, pageSizeAt, getDoc, isCurrentDoc } = ctx

  const propertiesVisible = ref(false)
  const docProperties = ref<PropertyRow[]>([])
  const pdfFileSize = ref(0)
  const pdfLinearized = ref(false)

  /**
   * 打开文档属性弹窗：基础信息先行展示，元数据异步补充
   */
  const loadProperties = () => {
    propertiesVisible.value = true
    const doc = getDoc()
    // 页面尺寸取当前页（CSS px → mm），并尽量标注常见纸张型号与方向
    const size = pageSizeAt(state.current)
    const rows: PropertyRow[] = [
      { label: '文件名', value: displayName() },
      { label: '文件大小', value: pdfFileSize.value ? `${formatBytes(pdfFileSize.value)}（${pdfFileSize.value.toLocaleString('en-US')} 字节）` : '—' },
      { label: '', value: '', divider: true },
      { label: '标题', value: '—' },
      { label: '作者', value: '—' },
      { label: '主题', value: '—' },
      { label: '关键词', value: '—' },
      { label: '创建日期', value: '—' },
      { label: '修改日期', value: '—' },
      { label: '创建者', value: '—' },
      { label: '', value: '', divider: true },
      { label: 'PDF 生成器', value: '—' },
      { label: 'PDF 版本', value: '—' },
      { label: '页数', value: String(state.total) },
      { label: '页面大小', value: pageSizeLabel(size.width, size.height) },
      { label: '', value: '', divider: true },
      { label: '快速 Web 视图', value: pdfLinearized.value ? '是' : '否' },
    ]
    docProperties.value = rows
    if (!doc) return
    doc
      .getMetadata()
      .then((meta) => {
        if (!isCurrentDoc(doc)) return
        const info = (meta.info ?? {}) as Record<string, unknown>
        const pick = (key: string) => (typeof info[key] === 'string' && info[key] ? (info[key] as string) : '—')
        const pickDate = (key: string) => formatPdfDate(info[key])
        const fill = (label: string, value: string) => {
          const row = rows.find((item) => item.label === label)
          if (row) row.value = value
        }
        fill('标题', pick('Title'))
        fill('作者', pick('Author'))
        fill('主题', pick('Subject'))
        fill('关键词', pick('Keywords'))
        fill('创建日期', pickDate('CreationDate'))
        fill('修改日期', pickDate('ModDate'))
        fill('创建者', pick('Creator'))
        fill('PDF 生成器', pick('Producer'))
        fill('PDF 版本', typeof info.PDFFormatVersion === 'string' ? info.PDFFormatVersion : '—')
        docProperties.value = [...rows]
      })
      .catch((error) => {
        console.error('PDF元数据读取失败:', error)
      })
  }

  return { propertiesVisible, docProperties, pdfFileSize, pdfLinearized, loadProperties }
}
