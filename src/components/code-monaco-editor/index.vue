<template>
  <div ref="codeEditBox" class="code-edit-box" :class="validateStatus ? 'error-border' : ''" />
</template>
<script lang="ts" setup>
import type { EditorProps, LanguageType } from '@/components/code-monaco-editor/types'
import { customSuggestOptions } from '@/components/code-monaco-editor/data'
import '@/components/code-monaco-editor/web-work'
import * as monaco from 'monaco-editor'
import { useMessage } from '@/hooks/use-message'
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CodeMonacoEditor',
  inheritAttrs: false,
})
const emits = defineEmits(['change'])
const props = withDefaults(defineProps<EditorProps>(), {
  width: '100%',
  height: '100%',
  placeholder: '有什么想表达的？快来输入吧✨...',
  fontSize: 16,
  minimap: false,
  validateStatus: false,
})
const modelValue = defineModel<string>('modelValue')
const language = defineModel<LanguageType>('language', {
  default: null,
  required: false,
})
const readonly = defineModel<boolean>('readonly', {
  default: false,
  required: false,
})
const themeStore = useThemeStore()
const { darkStatus } = storeToRefs(themeStore)
const codeEditBox = useTemplateRef<HTMLElement>('codeEditBox')
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>()

/**
 * 初始化编辑器
 */
const init = () => {
  const flag = true
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    // 核心：关闭模块解析相关的严格检查
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    allowSyntheticDefaultImports: true, // 允许从无默认导出的模块默认导入
    esModuleInterop: true,

    // 禁用未找到模块的错误（关键）
    skipLibCheck: true, // 跳过对库文件的类型检查
    noResolve: true, // 完全禁用模块解析（会导致所有导入都不验证，但可能引发其他问题）

    // 可选：关闭其他严格检查
    strict: false,
    noImplicitAny: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
  })
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
  })
  editor.value = monaco.editor.create(codeEditBox.value!, {
    value: modelValue.value,
    language: convertLanguage(language.value),
    theme: props.theme,
    readOnly: readonly.value, //只读
    placeholder: props.placeholder,
    fontSize: props.fontSize,
    minimap: { enabled: props.minimap }, //右边预览图
    suggest: customSuggestOptions, // 提示相关
    foldingStrategy: 'indentation', // 代码可分小段折叠
    smoothScrolling: true, //滚动状态
    domReadOnly: true,
    readOnlyMessage: {
      isTrusted: false,
      value: '正在预览中，此刻内容仅供查看，暂无法编辑 ✨!',
      supportThemeIcons: false,
      supportHtml: false,
    }, // 为只读时编辑内日提示词
    quickSuggestions: true,
    automaticLayout: true, // // 设置是否启用自动布局，使编辑器在容器尺寸变化时自动调整大小。
    formatOnPaste: true, //是否启用粘贴时自动格式化
    formatOnType: false, //是否启用输入时自动格式化
    contextmenu: true, //是否启用自定义右键菜单。
    wordWrap: flag ? 'wordWrapColumn' : 'off', //是否换行
    wordWrapColumn: 120,
    stickyScroll: {
      enabled: false,
    },
    mouseWheelZoom: true, //使用鼠标滚轮结合 Ctrl 键缩放字体
    scrollBeyondLastLine: false, // 滚动完最后一行后不准再滚动一屏幕
  })

  /**
   * 监听内容改变
   */
  editor.value.onDidChangeModelContent(() => {
    const value = editor.value?.getValue()
    modelValue.value = value
    emits('change', value)
  })
  /**
   * 监听只读编辑
   */
  editor.value.onDidAttemptReadOnlyEdit((_) => {
    useMessage().error('正在预览中，此刻内容仅供查看，暂无法编辑 ✨!')
  })
}
/**
 * 设置值
 * @param newValue
 */
const setValue = (newValue: string) => {
  editor.value?.setValue(newValue)
}
watch(
  () => language.value,
  (newValue) => {
    monaco.editor.setModelLanguage(editor.value!.getModel()!, convertLanguage(newValue))
  }
)
watch(
  () => darkStatus.value,
  (newValue) => {
    if (!props.theme) {
      editor.value?.updateOptions({
        theme: newValue ? 'vs-dark' : 'vs',
      })
    }
  },
  {
    immediate: true,
  }
)
/**
 * 转换语言
 * @param language 语言
 */
const convertLanguage = (language?: string | null): string => {
  if (!language) {
    return 'txt'
  }
  switch (language) {
    case 'vue':
    case 'ts':
      return 'typescript'
    case 'js':
      return 'javascript'
    default:
      return language
  }
}
onBeforeUnmount(() => {
  editor.value?.dispose()
})
onMounted(() => {
  nextTick(() => {
    init()
  })
})
defineExpose({
  setValue,
})
</script>
<style lang="scss" scoped>
.code-edit-box {
  border: 1px solid var(--el-border-color);
  width: v-bind(width);
  height: v-bind(height);

  :deep(.monaco-editor-overlaymessage) {
    display: none !important;
  }
}

.error-border {
  border: 1px solid var(--el-color-danger);
}
</style>
