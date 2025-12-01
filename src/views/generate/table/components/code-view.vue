<template>
  <el-drawer v-model="state.visibleStatus" :before-close="close" append-to-body size="100%" title="代码预览">
    <div class="xht-code-view-container">
      <div class="xht-code-view-main xht-code-view-select">
        <el-scrollbar view-style="overflow-x: hidden;">
          <div
            v-for="(item, index) in state.codeData"
            :key="index"
            :class="{ 'xht-code-view-item-active': state.activeTableName === item.tableName }"
            class="xht-code-view-item"
            @click="handleClickTableName(item)"
          >
            <span>{{ item.tableName }}</span>
            <span>
              <el-icon><arrow-right /></el-icon>
            </span>
          </div>
        </el-scrollbar>
      </div>
      <div class="xht-code-view-main xht-code-view-select">
        <el-scrollbar view-style="overflow-x: hidden;">
          <div
            v-for="(item, index) in state.twoCodeData"
            :key="index"
            :class="{ 'xht-code-view-item-active': state.activeFileName === item.fileName }"
            class="xht-code-view-item"
            @click="handleClickFileName(item)"
          >
            <span>{{ item.fileName }}</span>
            <span>
              <el-icon><arrow-right /></el-icon>
            </span>
          </div>
        </el-scrollbar>
      </div>
      <div class="flex-1">
        <code-monaco-editor ref="codeMonacoEditorRef" :language="state.activeFileType" readonly />
      </div>
    </div>
    <template #footer>
      <el-row>
        <el-col :span="6">
          <el-form-item label="包名">
            <el-input v-model="state.packageName" placeholder="请输入包名" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="flex-center!">
          <el-text truncated>{{ state.activeData?.filePath }}</el-text>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button :disabled="!state.packageName" icon="download" type="success">下载</el-button>
          <el-button :disabled="!state.activeData" icon="DocumentCopy" type="primary" @click="handleCopyCode">复制</el-button>
          <el-button icon="delete" type="danger" @click="close">关闭</el-button>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { ModeIdType } from '@/service/model/base.model'
import { viewCodeFileApi } from '@/service/api/generate/table.api'
import { ArrowRight } from '@element-plus/icons-vue'
import type { CodeViewState } from '@/service/model/generate/table.model'
import { useMessage } from '@/hooks/use-message'

defineOptions({
  name: 'CodeView',
})

/**
 * Monaco代码编辑器引用
 */
const codeMonacoEditorRef = useTemplateRef('codeMonacoEditorRef')
const { copy } = useClipboard()

/**
 * 组件状态管理
 */
const state = reactive<CodeViewState>({
  tableIds: [], // 表ID列表
  packageName: 'com.xht.demo', // 包名
  visibleStatus: false, // 抽屉可见状态
  loadingStatus: false, // 加载状态
  codeData: [], // 代码数据列表
  twoCodeData: [], // 当前选中表的代码文件列表
  activeData: null, // 当前激活的数据项
  activeFileType: 'java', // 当前激活的文件类型
  activeTableName: '', // 当前激活的表名
  activeFileName: '', // 当前激活的文件名
})

/**
 * 显示代码预览抽屉
 * @param tableIds - 需要预览代码的表ID数组
 */
const show = (tableIds: ModeIdType[]) => {
  state.tableIds = tableIds
  state.visibleStatus = true
  state.loadingStatus = true
  viewCodeFileApi(state.tableIds, state.packageName)
    .then((res) => {
      state.codeData = res.data
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 处理点击表名事件
 * @param item - 被点击的表数据对象
 */
const handleClickTableName = (item: any) => {
  state.twoCodeData = item.codes
  state.activeTableName = item.tableName
  state.activeData = null
  state.activeFileName = ''
  state.activeFileType = 'java'
  codeMonacoEditorRef.value?.setValue('')
}

/**
 * 处理点击文件名事件
 * @param item - 被点击的文件数据对象
 */
const handleClickFileName = (item: any) => {
  state.activeData = item
  state.activeFileName = item.fileName
  state.activeFileType = item.fileType
  codeMonacoEditorRef.value?.setValue(item.code)
}

/**
 * 关闭抽屉时的清理操作
 */
const close = () => {
  state.tableIds = [] // 表ID列表
  state.packageName = 'com.xht.demo' // 包名
  state.visibleStatus = false // 抽屉可见状态
  state.loadingStatus = false // 加载状态
  state.codeData = [] // 代码数据列表
  state.twoCodeData = [] // 当前选中表的代码文件列表
  state.activeData = null // 当前激活的数据项
  state.activeFileType = 'java' // 当前激活的文件类型
  state.activeTableName = '' // 当前激活的表名
  state.activeFileName = '' // 当前激活的文件名
  codeMonacoEditorRef.value?.setValue('')
}
/**
 * 复制代码
 */
const handleCopyCode = () => {
  if (state.activeData && state.activeData.code) {
    copy(state.activeData?.code)
    useMessage().success('复制成功!')
  } else {
    useMessage().error('请选择要复制的文件!')
  }
}

defineExpose({
  show,
})
</script>

<style lang="scss" scoped>
.xht-code-view-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  gap: 5px;

  user-select: none;

  .xht-code-view-main {
    width: 280px;
    box-sizing: border-box;
    border: 1px solid var(--xht-border-color);
  }

  .xht-code-view-item {
    width: 280px;
    height: 34px;
    line-height: 34px;
    font-size: 13px;
    padding: 0 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }

  .xht-code-view-item-active {
    color: var(--el-color-primary);
    font-weight: bold;
  }
}
</style>
