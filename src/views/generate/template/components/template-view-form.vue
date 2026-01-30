<script lang="ts" setup>
import { queryGenTemplateList, removeGenTemplateById } from '@/service/api/generate/template.api'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'
import { genTemplateOperationForm } from '@/views/generate/template/template.data'
import { Plus } from '@element-plus/icons-vue'

defineOptions({ name: 'TemplateViewForm' })

const emits = defineEmits(['success'])

interface Interface {
  groupId: ModeIdType
  data: GenTemplateOperationRequest[]
  visibleStatus: boolean
  loadingStatus: boolean
  nextTagId: number
}

const TemplateForm = defineAsyncComponent(() => import('@/views/generate/template/components/template-form.vue'))
const activeName = ref<ModeIdType>()
const state = reactive<Interface>({
  groupId: null,
  data: [],
  visibleStatus: false,
  loadingStatus: false,
  nextTagId: 1,
})
/**
 * 打开显示
 */
const show = async (groupId: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.loadingStatus = true
    state.groupId = groupId
    const { data } = await queryGenTemplateList(groupId)
    if (data && data.length > 0) {
      state.data = data
      activeName.value = data[0].id
    } else {
      addNewData()
    }
  } finally {
    state.loadingStatus = false
  }
}
/**
 * 设置激活的标签
 */
const setActiveName = (id: ModeIdType) => {
  activeName.value = id
}

/**
 * 处理删除
 */
const handleRemove = async (targetId: ModeIdType) => {
  state.loadingStatus = true
  if (!state.data || state.data.length <= 1) {
    state.loadingStatus = false
    useMessage().error('最少保留一个模板')
    return
  }
  await useMessageBox()
    .confirm('此操作将永久删除模板信息, 是否继续?')
    .then(async () => {
      const tabs = state.data
      let activeNameEmp = activeName.value
      let removeRequest = false
      tabs.forEach((tab, index) => {
        if (tab.id === targetId) {
          if (activeNameEmp === targetId) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeNameEmp = nextTab.id
            }
          }
          removeRequest = !tab.isNew
        }
      })
      if (removeRequest) {
        await removeGenTemplateById(targetId)
        activeName.value = activeNameEmp
        state.data = tabs.filter((tab) => tab.id !== targetId)
        state.data = state.data.filter((item) => item.id !== targetId)
        useMessage().success('删除模板信息成功!')
      }
    })
    .finally(() => {
      state.loadingStatus = false
    })
}

/**
 * 新增
 */
const addNewData = () => {
  activeName.value = state.nextTagId++
  state.data.push({
    ...genTemplateOperationForm,
    id: activeName.value,
    groupId: state.groupId,
    templateName: `NewTemplate${activeName.value}`,
    isNew: true,
  })
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.loadingStatus = false
  state.data = []
  state.nextTagId = 1
  state.groupId = null
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer
    v-model="state.visibleStatus"
    title="模板管理"
    size="100%"
    append-to-body
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-tabs v-model="activeName" addable class="!h-full" closable editable tab-position="left" @tab-remove="handleRemove">
      <template #add-icon>
        <el-button class="w-full" :icon="Plus" size="small" type="primary" @click="addNewData">添加</el-button>
      </template>
      <el-tab-pane v-for="(item, index) in state.data" :key="item.id" :label="item.templateName" :name="item.id" class="h-full" lazy>
        <template #label>
          <div class="w-160px flex">
            <div class="flex-center text-center text-12px font-bold">{{ index + 1 }}.</div>
            <div class="flex flex-1 items-center justify-end overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.templateName }}
            </div>
          </div>
        </template>
        <template-form :add-update-form="item" :loading-status="state.loadingStatus" @success="setActiveName" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__new-tab) {
  width: 100%;
  padding: 0 10px;
  border: none;
}

:deep(.el-tabs__item) {
  padding: 0 10px 0 0 !important;
}
</style>
