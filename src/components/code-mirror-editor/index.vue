<template>
  <div ref="editorContainer" class="editor-container" />
</template>

<script setup lang="ts">
import type { MirrorEditorProps } from '@/components/code-mirror-editor/types.ts'
import { onMounted, onUnmounted, watch } from 'vue'
import { EditorView ,keymap} from '@codemirror/view'
import { Compartment, EditorState } from '@codemirror/state'
import { indentWithTab } from "@codemirror/commands"
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { html } from '@codemirror/lang-html'
import { basicSetup } from 'codemirror'
import { boysAndGirls, espresso } from 'thememirror'
import { useThemeStore } from '@/store'

defineOptions({
  name: 'CodeMirrorEditorComponents',
})
const themeStore = useThemeStore()
// 1. 响应式数据：编辑器内容、配置
const props = withDefaults(defineProps<MirrorEditorProps>(), {
  readonly: false,
  language: 'java',
})
const modelValue = defineModel<string>('modelValue', {
  required: true,
})
//  emits 双向绑定事件
const emit = defineEmits<{
  (e: 'change', value: string): void // 内容变化事件
}>()

// 2. DOM 引用：编辑器挂载容器
const editorContainer = useTemplateRef<HTMLDivElement | null>('editorContainer')
// 3. CodeMirror 实例引用（TypeScript 类型定义）
const editorView = shallowRef<EditorView | null>()
const themeCompartment = new Compartment()

// 4. 初始化编辑器（在 DOM 挂载后执行）
onMounted(() => {
  if (!editorContainer.value) return
  // 4.1 配置编辑器状态（State）：内容、扩展（语言、主题、基础功能）
  const initialState = EditorState.create({
    doc: modelValue.value, // 初始内容（来自外部 props）
    extensions: [
      basicSetup,
      themeCompartment.of(themeStore.darkStatus ? boysAndGirls : espresso),
      // 根据 props.language 动态加载语言模式
      getLanguageExtension(props.language),
      // 只读配置（响应式 props.readonly）
      EditorView.editable.of(!props.readonly),
      EditorState.tabSize.of(4),
      // 内容变化监听：同步到外部 props
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          // 仅当文档内容变化时触发
          const newValue = update.state.doc.toString()
          modelValue.value = newValue
          emit('change', newValue) // 自定义变化事件
        }
      }),
      keymap.of([indentWithTab])
    ],
  })

  // 4.2 创建编辑器视图（View）：挂载到 DOM 容器
  editorView.value = new EditorView({
    state: initialState,
    parent: editorContainer.value,
  })
})

// 5. 组件卸载：销毁编辑器实例（避免内存泄漏）
onUnmounted(() => {
  editorView.value?.destroy()
  editorView.value = null
})
watch(
  () => themeStore.darkStatus,
  (newValue) => {
    console.log('themeStore.darkStatus', newValue)
    editorView.value?.dispatch({
      effects: themeCompartment.reconfigure(newValue ? boysAndGirls : espresso),
    })
  },
  {
    immediate: false,
  }
)

// 6. 监听外部 props 变化：同步到编辑器（如外部修改 modelValue）
watch(
  () => modelValue.value,
  (newValue) => {
    if (!editorView.value) return
    const currentValue = editorView.value.state.doc.toString()
    // 避免循环更新：仅当外部值与编辑器内部值不一致时同步
    if (newValue !== currentValue) {
      editorView.value.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: newValue,
        },
      })
    }
  },
  { immediate: false } // 初始化时不触发（避免覆盖初始内容）
)

// 7. 工具函数：根据语言类型返回对应的 CodeMirror 扩展
const getLanguageExtension = (language: string | undefined) => {
  switch (language) {
    case 'javascript':
      return javascript() // 来自 @codemirror/lang-javascript
    case 'html':
    case 'vue':
    case 'ts':
      return html()
    default:
      return java() // 默认语言：java
  }
}

// 8. 暴露给父组件的方法（可选，如获取编辑器实例、手动聚焦）
defineExpose({
  // 聚焦编辑器
  focus: () => {
    editorView.value?.focus()
  },
  // 获取当前编辑器内容
  getValue: (): string => {
    return editorView.value?.state.doc.toString() || ''
  },
})
</script>

<style scoped lang="scss">
.editor-container {
  width: 100%;
  height: 100%; /* 固定高度，可改为响应式（如 100vh - 200px） */
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

/* 解决 CodeMirror 内部样式穿透问题（scoped 样式无法覆盖） */
.editor-container :deep(.cm-editor) {
  height: 100%;
}

.editor-container :deep(.cm-scroller) {
  font-family: 'Fira Code', 'Consolas', monospace; /* 代码字体 */
  font-size: 14px;
}
</style>
