<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysAreaById, saveSysArea, updateSysArea } from '@/service/api/area/area.api'
import type { SysAreaOperationRequest } from '@/service/model/area/area.model'
import { sysAreaOperationForm, sysAreaOperationRules } from '@/views/area/area/area.data'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'SysAreaAddOrUpdate' })

const emits = defineEmits(['success'])
const state = reactive<AddUpdateOption<SysAreaOperationRequest>>({
  title: '增加系统管理-行政区划',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysAreaOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)
const rules: FormRules<Required<SysAreaOperationRequest>> = sysAreaOperationRules

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改系统管理-行政区划'
      const { data } = await querySysAreaById(id)
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
          await saveSysArea(addUpdateForm.value)
          useMessage().success(`新增系统管理-行政区划成功`)
        } else {
          await updateSysArea(addUpdateForm.value)
          useMessage().success(`修改系统管理-行政区划成功`)
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
  <el-drawer
    v-model="state.visibleStatus"
    :title="state.title"
    size="45%"
    append-to-body
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
      label-width="120px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级" prop="parentId">
            <el-input v-model="addUpdateForm.parentId" clearable :maxlength="100" show-word-limit placeholder="请输入上级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区划编码" prop="areaCode">
            <el-input v-model="addUpdateForm.areaCode" clearable :maxlength="100" show-word-limit placeholder="请输入区划编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区划名称" prop="areaName">
            <el-input v-model="addUpdateForm.areaName" clearable :maxlength="100" show-word-limit placeholder="请输入区划名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="areaPostCode">
            <el-input v-model="addUpdateForm.areaPostCode" clearable :maxlength="100" show-word-limit placeholder="请输入邮政编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="areaLongitude">
            <el-input v-model="addUpdateForm.areaLongitude" clearable :maxlength="100" show-word-limit placeholder="请输入经度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="areaLatitude">
            <el-input v-model="addUpdateForm.areaLatitude" clearable :maxlength="100" show-word-limit placeholder="请输入纬度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="areaSort">
            <el-input-number v-model="addUpdateForm.areaSort" :min="0" :max="999" class="w-full!" value-on-clear="min" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否存在下级" prop="hasChild">
            <el-input v-model="addUpdateForm.hasChild" clearable :maxlength="100" show-word-limit placeholder="请输入是否存在下级" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :disabled="state.loadingStatus" type="primary" @click="submitForm">提交</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
