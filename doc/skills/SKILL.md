---
name: xht-page-component
description: 用于在 xht-platform-admin 后台（Vue 3 + TypeScript + Element Plus + Pinia）中新增业务页面或通用组件——按仓库既有分层与写法生成 model / api / enum / data.ts / 列表页 / 弹窗表单 / 通用组件，并完成类型检查、lint 与联调自检。当用户提出"新增一个页面/列表页/弹窗/表单/通用组件/xht-xxx 组件"、"照着 user 模块做一个管理页"，或要把需求、原型落成 src/views、src/components、src/service 代码时使用。
---

# XHT 后台：新增页面 / 组件

本仓库有强约定（动态路由、请求信封、字典/枚举体系、CSS 变量主题）。照本流程执行可避免返工；与 `doc/开发文档.md` 冲突时**以该文档与现有代码为准**。

> 本文件是通用 Markdown 规范，不绑定任何 AI 工具。接入方式见同目录的 [`README.md`](README.md)：可直接把全文作为上下文喂给模型，也可把 `description` 里的触发条件写进工具自己的规则文件。

## 一、先判定落位

| 要新增的东西 | 落位 | 参考实现 |
| --- | --- | --- |
| 新的业务列表页 | `src/views/<域>/<模块>/index.vue` + 同级 `<模块>.data.ts` | `src/views/system/user/` |
| 仅本模块用的弹窗/表单 | `src/views/<域>/<模块>/components/xxx-form.vue` | `system/user/components/user-form.vue` |
| 跨模块复用的组件 | `src/components/<分类>/xht-xxx/index.vue` + 同目录 `types.ts` | `components/dict/xht-dict-select/` |
| 接口函数 | `src/service/api/<域>/<模块>.api.ts` | `system/user.api.ts` |
| DTO | `src/service/model/<域>/<模块>.model.ts` | `system/user.model.ts` |
| 枚举/状态字面量 | `src/service/enums/<域>/<模块>.enum.ts` | `system/user.enum.ts` |
| 全局状态 | `src/store/modules/<模块>.store.ts` | `user.store.ts` |
| 组合式逻辑 | `src/hooks/use-<能力>.ts` | `use-crud-hooks.ts` |

域目录固定为 `dashboard / generate / login / monitor / system / oauth2 / other`，新增业务需要新域时先与用户确认。

## 二、动手前必读三份现有实现

1. `src/views/system/user/index.vue`（列表页骨架：state + hooks + 查询区 + 工具栏 + 表格 + 分页 + 弹窗挂载）
2. `src/views/system/user/components/user-form.vue`（弹窗骨架：`AddUpdateOption` + `show()` + `emits('success')` + `el-drawer`）
3. `src/components/dict/xht-dict-select/`（通用组件骨架：`index.vue` + `types.ts` + `withDefaults` + 泛型 emits + `defineModel`）

## 三、流程 A：新增业务页面

按顺序执行，每步产出文件后再进入下一步：

1. **model** —— `<Domain>QueryRequest extends PageQueryRequest`、`<Domain>OperationRequest`、`<Domain>Response extends MetaResponse`、`<Domain>Vo`；主键一律 `ModeIdType`，字段名与后端一致，不做驼峰转换。
2. **enum** —— `export const xxxStatusEnum: DictEnum<XxxStatusType, 'A'|'B'>`，项为 `{ label, value, type }`（`type` 用 EP 语义色，不要写 `color: '#67C23A'`）。
3. **api** —— 文件顶部 `const baseURL = import.meta.env.VITE_ADMIN_API_PREFIX`，路径收进文件内 `enum Api`，函数命名为 `save / update / remove<Domain>ById(s) / query<Domain>Page|List|ById`，返回 `Promise<ApiResponse<T>>`。写操作一律 `method: 'post'`。
4. **data.ts** —— 导出 `xxxOperationForm`（表单初值）、`xxxOperationRules`（`FormRules<Required<...>>`）、`xxxColumnOption`（`ColumnConfig<Res>`，每列标 `desc / visible / disabled`）。
5. **index.vue** —— `defineOptions({ name: 'SysXxxViewIndex' })`；`reactive<TableQueryPageState<Req, Res>>` + `useTableQueryPageHooks`；查询区 `el-form + el-row/el-col`（`:xl="4" :lg="8" :md="8" :sm="12" :xs="24"`）；工具栏按钮挂 `v-authorization="['sys:xxx:create']"`；表格列用 `v-if="columnOption.xxx?.visible"`；枚举列用 `<xht-enum-tag>`；底部 `<xht-pagination>`。
6. **子组件** —— 弹窗用 `defineAsyncComponent` 懒加载，父页用 `useTemplateRef('xxxFormRef')` + `xxxFormRef.value?.show('create', null)`，监听 `@success="handlePageQuery"`。
7. **对齐路由与菜单** —— 后端菜单的 `component` 必须与 `src/views` 下路径逐字符一致（如 `/system/example/index`），否则"菜单能点、页面空白"；按钮权限串与 `v-authorization` 保持一致。

完整可复制代码：`references/page-workflow.md`。

## 四、流程 B：新增通用组件

1. 建目录 `src/components/<分类>/xht-xxx/`，内含 `index.vue` + `types.ts`。
2. `defineOptions({ name: 'XhtXxx', inheritAttrs: true })`；props 用 `withDefaults(defineProps<XhtXxxProps>(), {...})`（数组/对象默认值必须工厂函数）。
3. emits 用泛型 `defineEmits<XhtXxxEmits>()`，emits 接口写 `types.ts`；双向绑定优先 `defineModel<T>('modelValue', { required: true })`，不手写 `update:xxx`。
4. 样式：`<style scoped lang="scss">`，颜色/圆角/边框用 `var(--xht-*)` / `var(--el-*)`，布局间距优先 UnoCSS 原子类。
5. 无需手动注册——`unplugin-vue-components` 已把 `src/components/**/index.vue` 全局注册，页面里直接 `<xht-xxx>` 使用。
6. 事件名用 kebab-case（`remove-tag`、`click-node`），emits 类型集中在 `types.ts`。

完整可复制代码：`references/component-workflow.md`。

## 五、硬性约束（违反必返工）

| 约束 | 说明 |
| --- | --- |
| 不写显式 vue 导入 | `ref/reactive/computed/onMounted/useTemplateRef` 等由 auto-import 提供；只允许 `import type { ... } from 'vue'` |
| 不改请求内核 | `src/utils/request.ts` 的拦截器契约不可动；`request<T>` 返回业务信封，调用方取 `.data` |
| 不重复弹错误 | 错误提示由拦截器统一给；`catch` 只 `console.error` + 状态复位 |
| 颜色用变量 | 禁止字面量色值（含 UnoCSS `color-#xxxxxx`），否则暗黑模式失效 |
| 组件名必填 | `defineOptions({ name })`，eslint `vue/require-name-property` 强制 |
| 块顺序 | `script → template → style`，块之间空行（eslint 强制） |
| 弹窗容器 | 抽屉优先 `<el-drawer>`（22 处），简单确认再用 `<el-dialog>`（10 处） |
| DTO 只放 service | 禁止在 `.vue` 里内联 `interface XxxResponse` |
| 不新增依赖 | 版本互相咬合（Vite 8 / TS 6 / Router 5 / EP 2.14 / Pinia 4），加依赖先问 |
| 不碰路由清理 | 登出用 `resetRoutes()`，禁止 `router.clearRoutes()` |

## 六、自检（交付前必做）

```bash
# 1. 结构 + 违规扫描（本目录自带脚本，零依赖）
node doc/skills/scripts/check-module.mjs system/example
node doc/skills/scripts/check-module.mjs --component element-plus/xht-amount-input

# 2. 类型 + lint（仓库无 pre-commit 钩子，必须手动跑）
pnpm type-check
pnpm lint

# 3. 起服务看效果（菜单/权限需后端菜单配好）
pnpm dev
```

第一行是页面模式、第二行是组件模式（组件直接挂一级时省掉分类，如 `--component xht-card`）。它会检查文件是否齐备、目录名与 data.ts 前缀是否与模块一致，并扫描显式 vue 导入、`ElMessage` 直用、字面量色值、`clearRoutes`、内联 DTO、缺失 `defineOptions`、块顺序与空行、props 缺默认值、style 缺 scoped；输出形如 `:行号  规则名  说明`，退出码非 0 表示还有 error。逐条修完再交付。

## 七、常见返工点

1. 页面路径与菜单 `component` 不一致 → 菜单可点但白屏。
2. 忘记 `<模块>.data.ts`，列显隐配置写死在模板里 → 无法用 `table-tool-bar` 的列设置。
3. 弹窗没 `defineExpose({ show })`，父页调不到。
4. 提交成功后没 `emits('success')`，列表不刷新。
5. 查询参数没放进 `state.queryParams`，翻页后条件丢失。
6. 在 `catch` 里再弹一次 `useMessage().error(...)` → 双重提示。
7. 表格列没接 `columnOption.xxx?.visible` → 列设置开关无效。
8. 组件放在 `src/components/xxx/yyy.vue`（不是 `index.vue`）→ 不会自动注册。
9. 菜单按钮权限串与 `v-authorization` 不一致 → 按钮永久隐藏（超管除外）。
10. 用 `el-dialog` 写复杂表单导致内部滚动错乱 → 改用 `el-drawer`。
