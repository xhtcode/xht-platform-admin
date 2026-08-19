<script setup lang="ts">
import { useBpmnStore } from '@/store/modules/bpmn.store'
import { storeToRefs } from 'pinia'
import { UserFilled } from '@element-plus/icons-vue'
import BpmnPanelTitle from '@/components/bpmn-editor/components/bpmn-panel-title.vue'
import { useMessageBox } from '@/hooks/use-message'
import { useBpmnHooks } from '@/hooks/use.bpmn'
import { useBpmnUserHooks } from '@/components/bpmn-editor/components/bpmn-user.hooks'
import { generateUUID } from '@/utils'

defineOptions({
  name: 'BpmnPanelUser',
  inheritAttrs: false,
})
const bpmnStore = useBpmnStore()
const { bpmnRef } = useBpmnHooks()
const { activeElement, activeElementId } = storeToRefs(bpmnStore)
const { getAssigneeType, updateAssigneeType } = useBpmnUserHooks()
const assigneeType = ref<UserAssigneeType>('static')
const assignee = bpmnRef<string>('flowable:assignee')
const candidateUsers = bpmnRef<string>('flowable:candidateUsers')
const candidateGroups = bpmnRef<string>('flowable:candidateGroups')
const dueDate = bpmnRef<string>('flowable:dueDate')
const priority = bpmnRef<number>('flowable:priority')

/**
 * 处理分配类型改变
 */
const handlerAssigneeTypeChange = () => {
  useMessageBox()
    .confirm('此操作将清除已选的数据, 是否继续?')
    .then(() => {
      updateAssigneeType(assigneeType.value)
    })
    .catch(() => {
      assigneeType.value = 'static'
    })
}
onMounted(() => {
  assigneeType.value = getAssigneeType()
})
watch(
  () => activeElementId.value,
  () => {
    console.log(getAssigneeType())
    assigneeType.value = getAssigneeType()
  }
)
</script>

<template>
  <el-collapse-item name="bpmn-panel-user">
    <template #title>
      <bpmn-panel-title name="用户分配">
        <UserFilled />
      </bpmn-panel-title>
    </template>
    <el-form-item label="分配类型" class="mb-2!">
      <el-radio-group v-model="assigneeType" class="w-full!" @change="handlerAssigneeTypeChange">
        <el-radio-button label="固定值" value="static" />
        <el-radio-button label="身份存储" value="idm" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="分配人" class="mb-2!">
      <el-input v-model="assignee" placeholder="请输入分配人" />
    </el-form-item>
    <el-form-item label="候选用户" class="mb-2!">
      <el-input v-model="candidateUsers" placeholder="请输入候选用户" />
    </el-form-item>
    <el-form-item label="候选角色" class="mb-2!">
      <el-input v-model="candidateGroups" placeholder="请输入候选角色" />
    </el-form-item>
    <el-form-item label="到期日期" class="mb-2!">
      <el-input v-model="dueDate" placeholder="请输入到期日期" />
    </el-form-item>
    <el-form-item label="优先级" class="mb-0!">
      <el-input-number v-model="priority" :min="0" :max="999" class="w-full!" placeholder="请输入优先级" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
