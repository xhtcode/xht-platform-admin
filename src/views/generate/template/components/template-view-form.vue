<template>
  <el-drawer
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    title="模板管理"
    append-to-body
    size="100%"
  >
    <el-tabs
      v-model="activeName"
      class="!h-full"
      tab-position="left"
      closable
      addable
      editable
      @tab-remove="handleRemove"
    >
      <template #add-icon>
        <el-button class="w-full" type="primary" icon="Plus" size="small" @click="addNewData">
          添加
        </el-button>
      </template>
      <el-tab-pane
        class="h-full"
        :label="item.templateName"
        :name="item.id"
        v-for="item in state.data"
        :key="item.id"
        lazy
      >
        <template #label>
          <div class="w-120px whitespace-nowrap overflow-hidden text-ellipsis">
            {{ item.templateName }}
          </div>
        </template>
        <template-form :loading-status="state.loadingStatus" :add-update-form="item" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts" setup>
import { queryGenTemplateList, removeGenTemplateById } from '@/service/api/generate/template.api'

import type { GenTemplateOperationRequest } from '@/service/model/generate/template.model'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'
import TemplateForm from '@/views/generate/template/components/template-form.vue'
import { GenTemplateOperationForm } from '@/views/generate/template/template.data'

defineOptions({ name: 'TemplateViewForm' })

interface Interface {
  groupId: ModeIdType
  data: GenTemplateOperationRequest[]
  visibleStatus: boolean
  loadingStatus: boolean
  nextTagId: number
}

const activeName = ref<ModeIdType>()
const state = reactive<Interface>({
  groupId: null,
  data: [],
  visibleStatus: false,
  loadingStatus: false,
  nextTagId: 1,
})
const emits = defineEmits(['success'])
/**
 * 打开显示
 */
const show = async (groupId: ModeIdType) => {
  state.visibleStatus = true
  state.loadingStatus = true
  state.groupId = groupId
  await queryGenTemplateList(groupId)
    .then((response) => {
      if (response.data && response.data.length > 0) {
        state.data = response.data
      } else {
        addNewData()
      }
    })
    .catch(() => {
      useMessage().error('数据初始化加载失败')
    })
    .finally(() => {
      state.loadingStatus = false
    })
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
      activeName.value = activeNameEmp
      state.data = tabs.filter((tab) => tab.id !== targetId)
      if (removeRequest) {
        await removeGenTemplateById(targetId).then(async () => {
          useMessage().success('删除模板信息成功!')
        })
      }
      state.data = state.data.filter((item) => item.id !== targetId)
    })
    .catch((_) => {})
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
    ...GenTemplateOperationForm,
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
  state.visibleStatus = false
  state.loadingStatus = false
}
defineExpose({
  show,
})
</script>

<style lang="scss" scoped>
:deep(.el-tabs__new-tab) {
  width: 100%;
  padding: 0 10px;
  border: none;
}
</style>
