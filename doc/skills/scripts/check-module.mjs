#!/usr/bin/env node
/**
 * check-module.mjs —— 新增页面 / 组件后的结构与规范自检（零依赖，Node 18+）
 *
 * 用法：
 *   node doc/skills/scripts/check-module.mjs system/example
 *   node doc/skills/scripts/check-module.mjs --component element-plus/xht-amount-input
 *   node doc/skills/scripts/check-module.mjs --component xht-card
 *
 * 只做「本规范约定的那一部分」检查，不替代 pnpm type-check / pnpm lint。
 * 退出码：0 = 无错误（可有警告）；1 = 有错误；2 = 参数或路径问题。
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'

/* ------------------------------------------------------------------ */
/* 基础工具                                                            */
/* ------------------------------------------------------------------ */

const C = {
  reset: '\u001B[0m',
  dim: '\u001B[2m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  green: '\u001B[32m',
  cyan: '\u001B[36m',
  bold: '\u001B[1m',
}
const paint = (color, text) => (process.stdout.isTTY ? `${C[color]}${text}${C.reset}` : text)

/** 从脚本位置往上找仓库根（含 package.json 的目录） */
function findRepoRoot() {
  let dir = resolve(import.meta.dirname ?? dirname(new URL(import.meta.url).pathname))
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, 'package.json')) && existsSync(join(dir, 'src'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}

const ROOT = findRepoRoot()
const rel = abs => relative(ROOT, abs).split('\\').join('/')

const issues = []
const add = (level, file, line, rule, message) => issues.push({ level, file, line, rule, message })

const read = abs => readFileSync(abs, 'utf8')
const lines = text => text.split(/\r?\n/)

/** 收集目录下（递归）的 .vue / .ts 文件 */
function collectSources(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    const st = statSync(abs)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue
      out.push(...collectSources(abs))
    } else if (/\.(vue|ts)$/.test(name)) {
      out.push(abs)
    }
  }
  return out
}

const isKebab = s => /^[a-z][\d.a-z-]*$/.test(s) && !s.includes('_')
const isComment = t => /^\s*(\/\/|\/\*|\*)/.test(t)

/* ------------------------------------------------------------------ */
/* 规则                                                                */
/* ------------------------------------------------------------------ */

// 1. 显式 vue 值导入（auto-import 已提供）
const RE_VUE_NAMED = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*['"]vue['"]/g
const RE_VUE_DEFAULT = /import\s+(type\s+)?(\w+)\s*(?:,\s*\{[^}]*\})?\s*from\s*['"]vue['"]/g

// 2. 绕开 useMessage() 直用 EP 提示
const RE_DIRECT_MESSAGE = /\b(ElMessageBox|ElMessage|ElNotification)\b/

// 3. 字面量色值
const RE_HEX_COLOR = /#[0-9A-Fa-f]{3,8}\b/g
const RE_RGB_COLOR = /\brgba?\s*\(/

// 4. 路由清理
const RE_CLEAR_ROUTES = /\bclearRoutes\s*\(/

function lineOf(text, index) {
  let n = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++
  return n
}

/** 通用规则：.vue / .ts 都跑 */
function scanCommon(abs) {
  const text = read(abs)
  const file = rel(abs)
  const inVue = abs.endsWith('.vue')

  for (const m of text.matchAll(RE_VUE_NAMED)) {
    if (m[1]) continue
    const names = m[2].split(',').map(s => s.trim()).filter(Boolean)
    add('error', file, lineOf(text, m.index), 'no-explicit-vue-import',
      `显式导入 vue 值：${names.join(', ')}。auto-import 已全局提供，删掉该 import（只允许 import type { ... } from 'vue'）`)
  }
  for (const m of text.matchAll(RE_VUE_DEFAULT)) {
    if (m[1]) continue
    add('error', file, lineOf(text, m.index), 'no-explicit-vue-import',
      `显式导入 vue：${m[2]}。非组件入口文件不应从 'vue' 取运行时值`)
  }

  const all = lines(text)
  all.forEach((line, i) => {
    if (isComment(line) || /^\s*import\b/.test(line) || line.includes('use-message')) return
    const hit = line.match(RE_DIRECT_MESSAGE)
    if (hit) {
      add('warn', file, i + 1, 'use-message-hook',
        `直接使用 ${hit[1]}。统一走 const message = useMessage()，否则提示样式与错误处理口径不一致`)
    }
    if (RE_CLEAR_ROUTES.test(line)) {
      add('error', file, i + 1, 'no-clear-routes',
        '禁止 router.clearRoutes()（会清掉登录页/404 等静态路由）。登出用 resetRoutes()')
    }
    if (RE_HEX_COLOR.test(line)) {
      RE_HEX_COLOR.lastIndex = 0
      add('error', file, i + 1, 'no-literal-color',
        `字面量色值 ${line.match(RE_HEX_COLOR)[0]}。改用 var(--xht-*) / var(--el-*)，否则暗黑模式失效`)
    }
    RE_HEX_COLOR.lastIndex = 0
    if (RE_RGB_COLOR.test(line)) {
      add('error', file, i + 1, 'no-literal-color',
        '字面量 rgb()/rgba() 色值。改用 var(--xht-*) / var(--el-*)')
    }
  })

  if (inVue) scanVueShape(abs, text)
}

/** .vue 结构：宏、块顺序、块空行、内联 DTO */
function scanVueShape(abs, text) {
  const file = rel(abs)
  const all = lines(text)

  const nameLine = all.findIndex(l => /defineOptions\s*\(/.test(l))
  if (nameLine === -1) {
    add('error', file, 1, 'require-name-property',
      '缺少 defineOptions({ name: ... })。eslint vue/require-name-property 为 error，不加直接 lint 失败')
  } else {
    const block = text.slice(text.indexOf('defineOptions'))
    const nameMatch = block.slice(0, 300).match(/name\s*:\s*['"]([^'"]+)['"]/)
    if (!nameMatch) {
      add('error', file, nameLine + 1, 'require-name-property', 'defineOptions 里没写 name')
    } else if (!/^[A-Z]\w*$/.test(nameMatch[1])) {
      add('warn', file, nameLine + 1, 'name-pascal-case',
        `name: '${nameMatch[1]}' 不是 PascalCase。参照现有写法：Sys<Module>ViewIndex / Xht<Name>`)
    }
  }

  const order = ['<script', '<template', '<style'].map(tag => text.indexOf(tag))
  const present = order.map((idx, i) => ({ idx, tag: ['script', 'template', 'style'][i] }))
    .filter(x => x.idx >= 0)
  for (let i = 1; i < present.length; i++) {
    if (present[i].idx < present[i - 1].idx) {
      add('error', file, lineOf(text, present[i].idx), 'block-order',
        `块顺序应为 script → template → style，当前 ${present[i].tag} 在 ${present[i - 1].tag} 之前`)
      break
    }
  }
  for (const { idx, tag } of present.slice(1)) {
    const lineNo = lineOf(text, idx)
    if ((all[lineNo - 2] ?? '').trim() !== '') {
      add('error', file, lineNo, 'padding-line-between-blocks',
        `<${tag}> 前需空一行。eslint vue/padding-line-between-blocks 为 error`)
    }
  }

  const scriptStart = text.indexOf('<script')
  const scriptEnd = text.indexOf('</script>')
  if (scriptStart >= 0 && scriptEnd > scriptStart) {
    const script = text.slice(scriptStart, scriptEnd)
    const hint = file.startsWith('src/components/')
      ? '接口放同目录 types.ts，组件里只留 defineProps/defineEmits 引用'
      : 'DTO 一律放 src/service/model/<域>/<模块>.model.ts'
    for (const m of script.matchAll(/^[ \t]*(?:export\s+)?interface\s+([A-Z]\w*)/gm)) {
      add('error', file, lineOf(text, scriptStart + m.index), 'no-inline-dto',
        `.vue 里内联了 interface ${m[1]}。${hint}`)
    }
  }
}

/** 组件专属规则 */
function scanComponent(abs) {
  const text = read(abs)
  const file = rel(abs)

  if (/defineProps\s*</.test(text) && !/withDefaults\s*\(/.test(text)) {
    add('error', file, lineOf(text, text.indexOf('defineProps')), 'props-need-defaults',
      'props 用 withDefaults(defineProps<Props>(), {...}) 包一层。eslint vue/require-default-prop 为 error')
  }
  if (/defineEmits\s*\(\s*\[/.test(text)) {
    add('warn', file, lineOf(text, text.indexOf('defineEmits')), 'typed-emits',
      'defineEmits([...]) 是数组写法，新组件统一 defineEmits<XxxEmits>() 并把接口放 types.ts')
  }
  const styleIdx = text.indexOf('<style')
  if (styleIdx >= 0) {
    const tag = text.slice(styleIdx, text.indexOf('>', styleIdx) + 1)
    if (!/\bscoped\b/.test(tag)) {
      add('error', file, lineOf(text, styleIdx), 'style-scoped', `${tag} 缺少 scoped，组件样式会污染全局`)
    }
    if (!/lang=["']scss["']/.test(tag)) {
      add('warn', file, lineOf(text, styleIdx), 'style-lang', `${tag} 建议 lang="scss"，与仓库其余组件一致`)
    }
  }
}

/* ------------------------------------------------------------------ */
/* 结构检查                                                            */
/* ------------------------------------------------------------------ */

function checkPageFiles(domain, module) {
  const viewDir = join(ROOT, 'src/views', domain, module)
  const required = [
    [join(viewDir, 'index.vue'), '页面入口'],
    [join(viewDir, `${module}.data.ts`), '表单初值 / 校验 / 列配置'],
    [join(ROOT, 'src/service/api', domain, `${module}.api.ts`), '接口函数'],
    [join(ROOT, 'src/service/model', domain, `${module}.model.ts`), 'DTO'],
  ]
  const optional = [
    [join(ROOT, 'src/service/enums', domain, `${module}.enum.ts`), '枚举字典（有状态字段就需要）'],
  ]
  const rows = []
  for (const [abs, label] of required) {
    const ok = existsSync(abs)
    if (!ok) add('error', rel(abs), 0, 'missing-file', `缺少 ${label} 文件`)
    rows.push([ok, rel(abs), `${label}${ok ? '' : '（缺失）'}`])
  }
  for (const [abs, label] of optional) {
    const ok = existsSync(abs)
    if (!ok) add('warn', rel(abs), 0, 'missing-file', `没有 ${label}，确认确实不需要枚举`)
    rows.push([ok, rel(abs), `${label}${ok ? '' : '（缺失，可选）'}`])
  }

  if (!isKebab(module)) {
    add('error', `src/views/${domain}/${module}`, 0, 'dir-kebab-case',
      `目录名 ${module} 不是 kebab-case（对照现有：dict-item / notice-type / oauth2-client）`)
  }
  if (!existsSync(viewDir)) {
    add('error', `src/views/${domain}/${module}`, 0, 'missing-dir', '目录不存在，先建目录再落文件')
  }

  // .data.ts 前缀与目录一致（历史例外见 doc/开发文档.md）
  const KNOWN_EXCEPTIONS = ['system/file/base.data.ts', 'system/notice/base.data.ts', 'system/notice-type/type.data.ts', 'monitor/blog/log.data.ts']
  if (existsSync(viewDir) && !existsSync(join(viewDir, `${module}.data.ts`))) {
    for (const n of readdirSync(viewDir).filter(f => f.endsWith('.data.ts'))) {
      if (!KNOWN_EXCEPTIONS.includes(`${domain}/${module}/${n}`)) {
        add('warn', `src/views/${domain}/${module}/${n}`, 0, 'data-name-mismatch',
          `data.ts 前缀与目录名不一致（期望 ${module}.data.ts）。历史例外仅：${KNOWN_EXCEPTIONS.join(' / ')}`)
      }
    }
  }

  return { viewDir, rows }
}

function checkComponentFiles(raw) {
  const parts = raw.split('/').filter(Boolean)
  const name = parts.at(-1)
  const dir = join(ROOT, 'src/components', ...parts)
  const indexVue = join(dir, 'index.vue')
  const rows = []

  const okIndex = existsSync(indexVue)
  if (!okIndex) add('error', rel(indexVue), 0, 'missing-file', '缺少 index.vue（必须是 index.vue 才会被 unplugin-vue-components 自动注册）')
  rows.push([okIndex, rel(indexVue), '组件入口'])

  const okTypes = existsSync(join(dir, 'types.ts'))
  if (!okTypes) add('warn', rel(join(dir, 'types.ts')), 0, 'missing-file', '缺少 types.ts（props / emits 接口应集中放这里）')
  rows.push([okTypes, rel(join(dir, 'types.ts')), 'Props / Emits 接口'])

  if (!existsSync(dir)) add('error', rel(dir), 0, 'missing-dir', '目录不存在，先建目录再落文件')

  if (okIndex) {
    const text = read(indexVue)
    const m = text.slice(text.indexOf('defineOptions')).slice(0, 300).match(/name\s*:\s*['"]([^'"]+)['"]/)
    if (m) {
      const expected = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
      if (m[1] !== expected) {
        add('warn', rel(indexVue), 1, 'name-mismatch',
          `defineOptions name '${m[1]}' 与目录名推导的 '${expected}' 不一致，模板里用 <${name}> 时容易对不上`)
      }
    }
  }

  return { dir, rows }
}

/* ------------------------------------------------------------------ */
/* 输出                                                                */
/* ------------------------------------------------------------------ */

function printRows(rows) {
  for (const [ok, file, label] of rows) {
    console.log(`  ${ok ? paint('green', '✔') : paint('yellow', '✖')} ${file}  ${paint('dim', label)}`)
  }
}

function report() {
  const errors = issues.filter(i => i.level === 'error')
  const warns = issues.filter(i => i.level === 'warn')

  console.log('')
  if (issues.length === 0) {
    console.log(paint('green', '✔ 未发现结构或规范问题。别忘了继续跑 pnpm type-check / pnpm lint。'))
    return 0
  }

  const grouped = new Map()
  for (const i of issues) {
    if (!grouped.has(i.file)) grouped.set(i.file, [])
    grouped.get(i.file).push(i)
  }
  for (const [file, list] of [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(paint('bold', file))
    for (const i of list.sort((a, b) => a.line - b.line)) {
      const tag = i.level === 'error' ? paint('red', '错误') : paint('yellow', '警告')
      const at = i.line > 0 ? paint('dim', `:${i.line}`) : paint('dim', '   ')
      console.log(`  ${tag} ${at}  ${paint('cyan', i.rule)}  ${i.message}`)
    }
    console.log('')
  }

  console.log(`${paint(errors.length ? 'red' : 'green', `${errors.length} 个错误`)} / ${paint('yellow', `${warns.length} 个警告`)}`)
  return errors.length > 0 ? 1 : 0
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

function usage() {
  console.log(`
用法：
  node check-module.mjs <域>/<模块>                             页面模式，如 system/example
  node check-module.mjs --component <分类>/<组件名>              组件模式，如 element-plus/xht-amount-input
  node check-module.mjs --component <组件名>                     组件直接挂在一级时，如 xht-card

检查内容：
  结构  文件齐备、目录名 kebab-case、data.ts 前缀、index.vue 落位
  规范  显式 vue 导入 / ElMessage 直用 / 字面量色值 / clearRoutes /
        内联 DTO / defineOptions / 块顺序与空行 / props 默认值 / style scoped
`)
}

function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    usage()
    return argv.length === 0 ? 2 : 0
  }

  const cIdx = argv.indexOf('--component')
  const component = cIdx >= 0 ? argv[cIdx + 1] : undefined
  const target = argv.find((a, i) => !a.startsWith('-') && !(cIdx >= 0 && i === cIdx + 1))

  console.log(paint('dim', `仓库根：${ROOT}`))

  let files
  if (component) {
    console.log(paint('bold', `\n[xht-check] 组件模式：src/components/${component}`))
    const { dir, rows } = checkComponentFiles(component)
    console.log('\n结构')
    printRows(rows)
    files = collectSources(dir)
  } else {
    const [domain, module] = (target ?? '').split('/')
    if (!domain || !module) {
      console.error(paint('red', '参数错误：页面模式需要 <域>/<模块>，例如 system/example'))
      usage()
      return 2
    }
    if (!existsSync(join(ROOT, 'src/views', domain))) {
      const tip = existsSync(join(ROOT, 'src/components', domain))
        ? `\n路径 src/components/${target} 存在——如果是要检查组件，请加 --component：\n  node doc/skills/scripts/check-module.mjs --component ${target}`
        : ''
      console.error(paint('red', `域目录不存在：src/views/${domain}。现有域：dashboard / generate / login / monitor / system / oauth2 / other${tip}`))
      return 2
    }
    console.log(paint('bold', `\n[xht-check] 页面模式：src/views/${domain}/${module}`))
    const { viewDir, rows } = checkPageFiles(domain, module)
    console.log('\n结构')
    printRows(rows)
    files = [
      ...collectSources(viewDir),
      join(ROOT, 'src/service/api', domain, `${module}.api.ts`),
      join(ROOT, 'src/service/model', domain, `${module}.model.ts`),
      join(ROOT, 'src/service/enums', domain, `${module}.enum.ts`),
    ].filter(existsSync)
  }

  console.log(`\n规范扫描 ${paint('dim', `(${files.length} 个文件)`)}`)
  for (const abs of files) {
    scanCommon(abs)
    if (component) scanComponent(abs)
  }

  return report()
}

process.exitCode = main()
