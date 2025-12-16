// uno.config.js
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import fs from 'node:fs'
// 本地SVG图标目录
const iconsDir = './src/assets/icons'

/**
 * 读取本地 SVG 目录，自动生成 safelist
 */
const generateSafeList = () => {
  const result: string[] = []
  try {
    result.push(
      ...fs
        .readdirSync(iconsDir)
        .filter((file) => file.endsWith('.svg'))
        .map((file) => `i-common-${file.replace('.svg', '')}`)
    )
    result.push(
      ...fs
        .readdirSync(`${iconsDir}/menu`)
        .filter((file) => file.endsWith('.svg'))
        .map((file) => `i-menu-${file.replace('.svg', '')}`)
    )
  } catch (error) {
    console.error('无法读取图标目录:', error)
  }
  return result
}

/**
 * SVG图标转换函数
 * @param svg SVG图标内容
 */
const transform = (svg: string) => {
  return svg.includes('fill="') ? svg : svg.replace(/^<svg /, '<svg fill="currentColor" ')
}

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  presets: [
    presetUno(), // 添加 UnoCSS 的默认样式预设
    presetAttributify({}),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    presetIcons({
      scale: 1.2, // 图标缩放比例
      prefix: 'i-', // 图标前缀
      warn: true, //当缺少的图标匹配时发出警告
      extraProperties: {
        // 额外属性
        display: 'inline-block',
        width: '16px',
        height: '16px',
      },
      // 图表集合
      collections: {
        // icon 是图标集合名称，使用 `i-icon:图标名` 调用
        common: FileSystemIconLoader(iconsDir, transform),
        login: FileSystemIconLoader(`${iconsDir}/login`, transform),
        menu: FileSystemIconLoader(`${iconsDir}/menu`, transform),
      },
    }),
  ],
  safelist: [...generateSafeList()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    'm-0-auto': 'm-0 ma', // margin: 0 auto
    'wh-full': 'w-full h-full', // width: 100%, height: 100%
    'flex-center': 'flex justify-center items-center', // flex布局居中
    'flex-x-center': 'flex justify-center', // flex布局：主轴居中
    'flex-y-center': 'flex items-center', // flex布局：交叉轴居中
    'text-overflow': 'overflow-hidden whitespace-nowrap text-ellipsis', // 文本溢出显示省略号
    'flex-x-start': 'flex items-center justify-start',
    'flex-x-between': 'flex items-center justify-between',
    'flex-x-end': 'flex items-center justify-end',
    'text-break': 'whitespace-normal break-all break-words', // 文本溢出换行
  },
  theme: {
    /**
     * 响应式设计
     */
    breakpoints: {
      xxs: '0px',
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1600px',
    },
  },
})
