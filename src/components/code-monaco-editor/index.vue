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
const props = withDefaults(defineProps<EditorProps>(), {
  width: '100%',
  height: '100%',
  placeholder: '有什么想表达的？快来输入吧✨...',
  fontSize: 16,
  minimap: false,
  validateStatus: false,
})
const emits = defineEmits(['change'])
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
const setValueStatus = shallowRef<boolean>(true)
/**
 * 初始化编辑器
 */
const init = () => {
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
      value: '暂无文件编辑权限 ✨!',
      supportThemeIcons: false,
      supportHtml: false,
    }, // 为只读时编辑内日提示词
    quickSuggestions: true,
    automaticLayout: true, // // 设置是否启用自动布局，使编辑器在容器尺寸变化时自动调整大小。
    formatOnPaste: false, //是否启用粘贴时自动格式化
    formatOnType: false, //是否启用输入时自动格式化
    contextmenu: false, //是否启用自定义右键菜单。
    wordWrap: 'off', //是否换行
    wordWrapColumn: 120,
    stickyScroll: {
      enabled: false,
    },
    lineNumbers: 'on', // 行号
    lineNumbersMinChars: 3,
    mouseWheelZoom: true, //使用鼠标滚轮结合 Ctrl 键缩放字体
    scrollBeyondLastLine: false, // 滚动完最后一行后不准再滚动一屏幕
    scrollbar: {
      /**
       * 箭头的大小（如果显示的话）。
       * 默认值为11。
       * **注意**：此选项无法通过 `updateOptions()` 更新
       */
      arrowSize: 5,
      /**
       * 渲染垂直滚动条。
       * 默认值为 'auto'。
       */
      vertical: 'visible',
      /**
       * 渲染水平滚动条。
       * 默认值为 'auto'，鼠标移出会隐藏
       */
      horizontal: 'visible',
      /**
       * 水平滚动条的高度（像素）。
       * 默认值为10（像素）。
       */
      horizontalScrollbarSize: 5,
      /**
       * 垂直滚动条的宽度（像素）。
       * 默认值为10（像素）。
       */
      verticalScrollbarSize: 5,
      /**
       * 垂直滑块的宽度（像素）。
       * 默认值等于 `verticalScrollbarSize`。
       * **注意**：此选项无法通过 `updateOptions()` 更新
       */
      verticalSliderSize: 5,
      /**
       * 水平滑块的高度（像素）。
       * 默认值等于 `horizontalScrollbarSize`。
       * **注意**：此选项无法通过 `updateOptions()` 更新
       */
      horizontalSliderSize: 5,
      /**
       * 设置后，水平滚动条不会影响编辑器的内容高度
       * 默认值为false，会占用编辑器的内容高度
       */
      ignoreHorizontalScrollbarInContentHeight: false,
    },
  })

  /**
   * 监听内容改变
   */
  editor.value.onDidChangeModelContent(() => {
    if (setValueStatus.value) {
      setValueStatus.value = false
      return
    }
    const value = editor.value?.getValue()
    modelValue.value = value
    emits('change', value)
  })
  /**
   * 监听只读编辑
   */
  editor.value.onDidAttemptReadOnlyEdit((_) => {
    useMessage().error('暂无文件编辑权限 ✨!')
  })
}
/**
 * 设置值
 * @param newValue
 */
const setValue = (newValue: string) => {
  setValueStatus.value = true
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
    case 'sql':
      return 'sql'
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

<template>
  <div ref="codeEditBox" class="code-edit-box" :class="validateStatus ? 'error-border' : ''" />
</template>

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
