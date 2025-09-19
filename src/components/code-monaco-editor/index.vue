<template>
  <div ref="codeEditBox" class="codeEditBox" />
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
    language: language.value as any,
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
    automaticLayout: false, // // 设置是否启用自动布局，使编辑器在容器尺寸变化时自动调整大小。
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
  editor.value.onDidAttemptReadOnlyEdit((e) => {
    console.log(e)
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
    monaco.editor.setModelLanguage(editor.value!.getModel()!, newValue as string)
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

onBeforeUnmount(() => {
  editor.value?.dispose()
})
onMounted(() => {
  init()
})
defineExpose({
  setValue,
})
</script>
<style lang="scss" scoped>
.codeEditBox {
  width: v-bind(width);
  height: v-bind(height);

  :deep(.monaco-editor-overlaymessage) {
    display: none !important;
  }
}
</style>
