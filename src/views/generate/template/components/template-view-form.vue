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
      stretch
      closable
      addable
      @tab-click="handleClick"
    >
      <el-tab-pane
        class="h-full"
        :label="item.templateName"
        :name="item.id"
        v-for="item in state.data"
        :key="item.id"
      >
        <template-form :loading-status="state.loadingStatus" :add-update-form="item" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="close">取 消</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { queryGenTemplateList } from '@/service/api/generate/template.api'

import type { GenTemplateResponse } from '@/service/model/generate/template.model'
import { useMessage } from '@/hooks/use-message'
import type { ModeIdType } from '@/service/model/base.model'
import TemplateForm from '@/views/generate/template/components/template-form.vue'
import { GenTemplateOperationForm } from '@/views/generate/template/template.data'

defineOptions({ name: 'TemplateViewForm' })

interface Interface {
  groupId: ModeIdType
  data: GenTemplateResponse[]
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
  await queryGenTemplateList(groupId)
    .then((response) => {
      if (response.data && response.data.length > 0) {
        state.data = response.data
      } else {
        activeName.value = state.nextTagId++
        state.data = [
          {
            ...GenTemplateOperationForm,
            id: activeName.value,
            groupId: groupId,
            templateName: 'demo',
          },
        ]
      }
    })
    .catch(() => {
      useMessage().error('数据初始化加载失败')
    })
    .finally(() => {
      state.loadingStatus = false
    })
}
const handleClick = () => {}

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

<style scoped></style>
