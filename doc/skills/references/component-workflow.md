# 新增通用组件：完整模板

以 `xht-amount-input`（金额输入）为例。替换 `xht-xxx / XhtXxx / xhtAmount` 即可。

## 0. 目录与文件

```
src/components/<分类>/xht-amount-input/
├── index.vue      # 组件实现（必须叫 index.vue，否则不会被自动注册）
└── types.ts       # Props / Emits / 局部类型
```

分类目录现有：`code-monaco-editor`、`dict`、`element-plus`、`enums`、`generate`、`icon-select`、`system`、`table-tool-bar`、`xht-authorization`、`xht-card`。新分类按语义新增，不要平铺到 `src/components/` 根下。

## 1. types.ts

```ts
/**
 * 金额输入框属性
 */
export interface XhtAmountInputProps {
  precision?: number // 小数位数
  min?: number // 最小值
  max?: number // 最大值
  disabled?: boolean // 是否禁用
  placeholder?: string // 占位符
  clearable?: boolean // 是否可清空
}

/**
 * 金额输入框 emit
 */
export interface XhtAmountInputEmits {
  (e: 'change', value?: number): void
  (e: 'blur'): void
  (e: 'focus'): void
}
```

命名规则：`XhtXxxProps` / `XhtXxxEmits`，与组件目录名对应；emits 用调用签名写法（与 `src/components/dict/xht-dict-select/types.ts` 一致）。

## 2. index.vue

```vue
<script setup lang="ts">
import type { XhtAmountInputEmits, XhtAmountInputProps } from '@/components/element-plus/xht-amount-input/types'

defineOptions({
  name: 'XhtAmountInput',
  inheritAttrs: true,
})

const props = withDefaults(defineProps<XhtAmountInputProps>(), {
  precision: 2, // 小数位数
  min: 0, // 最小值
  max: undefined, // 最大值
  disabled: false, // 是否禁用
  placeholder: '请输入金额', // 占位符
  clearable: true, // 是否可清空
})

const emits = defineEmits<XhtAmountInputEmits>()

/**
 * 金额（双向绑定）
 */
const modelValue = defineModel<number | undefined>('modelValue', {
  required: true,
})

/**
 * 输入变化
 * @param value 输入值
 */
const handleChange = (value?: number) => {
  const next = formatValue(value)
  modelValue.value = next
  emits('change', next)
}

/**
 * 按精度与上下限规整数值
 * @param value 原始值
 */
const formatValue = (value?: number): number | undefined => {
  if (value === undefined || value === null || Number.isNaN(value)) return undefined
  let next = Number(value.toFixed(props.precision))
  if (props.min !== undefined && next < props.min) next = props.min
  if (props.max !== undefined && next > props.max) next = props.max
  return next
}
</script>

<template>
  <el-input-number
    v-model="modelValue"
    :controls="false"
    :disabled="props.disabled"
    :max="props.max"
    :min="props.min"
    :placeholder="props.placeholder"
    :precision="props.precision"
    class="w-full"
    @blur="emits('blur')"
    @change="handleChange"
    @focus="emits('focus')"
  />
</template>

<style lang="scss" scoped>
:deep(.el-input__inner) {
  text-align: right;
  color: var(--xht-text-color);
}
</style>
```

## 3. 写法规则

| 规则 | 做法 |
| --- | --- |
| 组件名 | `defineOptions({ name: 'XhtXxx' })`，大驼峰，与目录名对应（eslint 强制） |
| Props | 泛型 + `withDefaults`；对象/数组默认值必须 `() => ({})` / `() => []` |
| 透传 | 需要透传 `class`/`style`/原生属性时 `inheritAttrs: true`（默认）并在根元素上生效；分页这类需要精确控制的用 `inheritAttrs: false` + `:class="props.class"` |
| Emits | 泛型接口集中在 `types.ts`；事件名多词用 kebab-case |
| 双向绑定 | 用 `defineModel`，不要手写 `props.modelValue + emits('update:modelValue')` |
| 自动导入 | 不写 `import { ref, computed } from 'vue'` |
| 插槽 | 超过 2 个插槽时在 `types.ts` 补 `XhtXxxSlots` 说明用途 |
| 样式 | `<style scoped lang="scss">`；颜色/圆角/边框必须 `var(--xht-*)` / `var(--el-*)`；穿透用 `:deep()` |
| 尺寸/间距 | 优先 UnoCSS 原子类（`w-full`、`flex-center`、`gap-2`） |
| 内置提示 | 不在组件内弹 `useMessage()`；把失败/异常通过事件抛给调用方 |
| 数据来源 | 展示型组件只收 props，不直接调 api/store；确需取字典用 `useDictHooks` |

## 4. 使用方式

组件已由 `unplugin-vue-components` 自动注册（`globs: ['src/components/**/index.vue']`），页面里直接用标签，**不要 import**：

```vue
<xht-amount-input v-model="form.amount" :max="100000" @change="handleAmountChange" />
```

若组件放在 `src/components/xxx/yyy.vue`（不是 `index.vue`），则不会自动注册，只能显式 import——这是不允许的写法。

## 5. 拆分原则

- 页面级私有 UI 不要上提到 `src/components`，放 `views/<域>/<模块>/components/`。
- 出现以下任一情况拆子组件：内部有独立业务请求、模板超过约 150 行、同一段模板在 2 处以上重复。
- 不要为了复用而强行抽象：只有第 2 个调用方出现时再抽。

## 6. 验收

```bash
node doc/skills/scripts/check-module.mjs --component element-plus/xht-amount-input
pnpm type-check
pnpm lint
```

再在任意页面挂一个实例确认：默认值生效、`v-model` 双向同步、禁用态样式正确、暗黑模式下颜色正常。
