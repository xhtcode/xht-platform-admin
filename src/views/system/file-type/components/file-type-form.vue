<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { querySysFileTypeById, saveSysFileType, updateSysFileType } from '@/service/api/system/file-type.api'
import { filePreviewTypeEnum } from '@/service/enums/system/file.enum'
import type { SysFileTypeOperationRequest } from '@/service/model/system/file-type.model'
import { sysFileTypeOperationForm, sysFileTypeOperationRules } from '@/views/system/file-type/file-type.data'

defineOptions({ name: 'SysFileTypeForm' })

const emits = defineEmits(['success'])

const state = reactive<AddUpdateOption<SysFileTypeOperationRequest>>({
  title: '新增预览类型配置',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysFileTypeOperationForm },
})
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const { addUpdateForm } = toRefs(state)

/**
 * 预览类型编码对应的默认名称
 * @param value 预览类型编码
 */
const getPreviewNameByType = (value?: string | string[]): string | undefined => {
  return Object.values(filePreviewTypeEnum).find((item) => item.value === value)?.label
}

/**
 * 预览类型变更时同步名称
 *
 * 仅当名称为空、或仍是某个预览类型的默认名称时才覆盖，避免冲掉用户自定义的名称。
 */
const handlePreviewTypeChange = (value?: string | string[]) => {
  const previewName = addUpdateForm.value.previewName?.trim()
  const defaultNames = Object.values(filePreviewTypeEnum).map((item) => item.label)
  if (previewName && !defaultNames.includes(previewName)) return
  const nextPreviewName = getPreviewNameByType(value)
  if (nextPreviewName) addUpdateForm.value.previewName = nextPreviewName
}

/**
 * 打开显示
 * @param type 操作类型
 * @param id 配置ID
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  // 每次打开先回到初始值，避免上次修改残留的主键混进本次提交
  addUpdateForm.value = { ...sysFileTypeOperationForm }
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    state.title = type === 'create' ? '新增预览类型配置' : '修改预览类型配置'
    if (type === 'update') {
      const { data } = await querySysFileTypeById(id)
      addUpdateForm.value = {
        id: data.id,
        previewType: data.previewType,
        previewName: data.previewName,
        fileSuffix: data.fileSuffix ?? null,
        sort: data.sort ?? 1,
      }
    }
  } catch (error) {
    // 详情查询失败提示已由请求拦截器给出；关闭抽屉，避免在拿不到主键的情况下误提交更新
    console.error('预览类型配置详情查询失败:', error)
    state.visibleStatus = false
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  addUpdateForm.value = { ...sysFileTypeOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  addUpdateFormRef.value?.resetFields()
}

/**
 * 提交表单
 */
const submitForm = () => {
  state.loadingStatus = true
  addUpdateFormRef.value?.validate(async (valid) => {
    if (!valid) {
      state.loadingStatus = false
      useMessage().error('表单校验未通过，请重新检查提交内容')
      return
    }
    try {
      // 后缀整体覆盖语义：空值传 null，避免写入空串
      const form: SysFileTypeOperationRequest = {
        ...addUpdateForm.value,
        fileSuffix: addUpdateForm.value.fileSuffix?.trim() || null,
      }
      const request = state.operationStatus === 'create' ? saveSysFileType : updateSysFileType
      await request(form)
      useMessage().success(`${state.title}成功`)
      state.loadingStatus = false
      emits('success')
      close()
    } catch (error) {
      // 保存失败提示已由请求拦截器给出，保留抽屉与已填内容便于重试
      console.error('预览类型配置保存失败:', error)
    } finally {
      state.loadingStatus = false
    }
  })
}

defineExpose({
  show,
})
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :title="state.title"
    append-to-body
    class="xht-dialog"
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="sysFileTypeOperationRules"
      inline-message
      label-width="110px"
      scroll-to-error
    >
      <el-form-item label="预览类型" prop="previewType">
        <xht-enum-select
          v-model="addUpdateForm.previewType"
          :data="filePreviewTypeEnum"
          placeholder="请选择预览类型"
          @change="handlePreviewTypeChange"
        />
      </el-form-item>
      <el-form-item label="类型名称" prop="previewName">
        <el-input v-model="addUpdateForm.previewName" :maxlength="30" disabled placeholder="请输入预览类型名称" show-word-limit />
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input v-model="addUpdateForm.fileSuffix" :maxlength="30" placeholder="如 jpg，留空表示该预览类型的默认名称配置" show-word-limit />
      </el-form-item>
      <el-form-item label="类型排序">
        <el-input-number :model-value="addUpdateForm.sort" :max="999" :min="1" class="!w-full" placeholder="请输入类型排序" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :loading="state.loadingStatus" type="primary" @click="submitForm">提 交</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
