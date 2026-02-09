<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysNoticeTypeById, saveSysNoticeType, updateSysNoticeType } from '@/service/api/notice/type.api'
import { NoticeTypeStatusEnums, SysNoticeTypeOperationRequest } from '@/service/model/notice/type.model'
import { sysNoticeTypeOperationForm, sysNoticeTypeOperationRules } from '@/views/notice/type/type.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'SysNoticeTypeAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysNoticeTypeOperationRequest>>({
  title: '增加系统管理-通知类型',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysNoticeTypeOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysNoticeTypeOperationRequest>> = sysNoticeTypeOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改系统管理-通知类型'
      const { data } = await querySysNoticeTypeById(id)
      addUpdateForm.value = data
    }
    state.loadingStatus = false
  } catch {
    state.loadingStatus = false
  }
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (state.operationStatus === 'create') {
          await saveSysNoticeType(addUpdateForm.value)
          useMessage().success(`新增系统管理-通知类型成功`)
        } else {
          await updateSysNoticeType(addUpdateForm.value)
          useMessage().success(`修改系统管理-通知类型成功`)
        }
        emits('success')
        state.loadingStatus = false
        close()
      } catch {
        state.loadingStatus = false
      }
    } else {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
    }
  })
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :title="state.title"
    width="35%"
    append-to-body
    draggable
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :before-close="close"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
      element-loading-text="拼命加载中"
      inline-message
      label-width="100px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型名称" prop="noticeTypeName">
            <el-input v-model="addUpdateForm.noticeTypeName" clearable :maxlength="100" show-word-limit placeholder="请输入类型名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型状态" prop="noticeTypeStatus">
            <el-select v-model="addUpdateForm.noticeTypeStatus" clearable placeholder="请选择类型状态">
              <el-option label="未启用" :value="NoticeTypeStatusEnums.NOT_ENABLE" />
              <el-option label="启用" :value="NoticeTypeStatusEnums.ENABLE" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通知排序" prop="noticeTypeSort">
            <el-input-number
              v-model="addUpdateForm.noticeTypeSort"
              :min="0"
              :max="999"
              class="w-full!"
              value-on-clear="min"
              placeholder="请输入通知类型排序"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
