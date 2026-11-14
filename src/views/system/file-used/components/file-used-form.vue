<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { querySysFileUsedById, saveSysFileUsed, updateSysFileUsed } from '@/service/api/system/file-used.api'
import type { SysFileUsedOperationRequest } from '@/service/model/system/file-used.model'
import { sysFileUsedOperationForm, sysFileUsedOperationRules } from '@/views/system/file-used/file-used.data'
import { fileUsedEnabledEnum } from '@/service/enums/system/file-used.enum.ts'

defineOptions({ name: 'SysFileUsedForm' })

const emits = defineEmits(['success'])
const message = useMessage()

const state = reactive<AddUpdateOption<SysFileUsedOperationRequest>>({
  title: '新增文件用途',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...sysFileUsedOperationForm },
})
const formRef = useTemplateRef<FormInstance>('formRef')
const { addUpdateForm } = toRefs(state)

/**
 * 编辑中的记录ID（仅修改时存在）
 */
const editingId = ref<ModeIdType>('')

/**
 * 打开弹窗
 *
 * 修改时按 ID 拉取详情回显，保证字段与库中一致（分页行数据可能来自旧查询）
 *
 * @param type 操作类型
 * @param id 用途ID（修改时必传）
 */
const show = async (type: 'create' | 'update', id: ModeIdType | null) => {
  state.operationStatus = type
  state.title = type === 'create' ? '新增文件用途' : '修改文件用途'
  state.addUpdateForm = { ...sysFileUsedOperationForm }
  editingId.value = ''
  if (type === 'update' && id) {
    editingId.value = id
    state.loadingStatus = true
    try {
      const { data } = await querySysFileUsedById(id)
      // 只回填表单字段，忽略 builtIn / fileCount / updateTime 等只读字段
      state.addUpdateForm = {
        id: data.id,
        usedCode: data.usedCode,
        usedName: data.usedName,
        usedDesc: data.usedDesc ?? '',
        usedEnabled: data.usedEnabled,
        usedSort: data.usedSort,
      }
    } catch (error) {
      // 失败提示由请求拦截器给出，直接放弃本次编辑
      console.error('文件用途详情查询失败:', error)
      return
    } finally {
      state.loadingStatus = false
    }
  }
  state.visibleStatus = true
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.visibleStatus = false
  state.operationStatus = 'create'
  editingId.value = ''
  formRef.value?.resetFields()
}

/**
 * 提交
 */
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      message.error('表单校验未通过，请重新检查提交内容')
      return
    }
    state.loadingStatus = true
    try {
      const form: SysFileUsedOperationRequest = {
        ...state.addUpdateForm,
      }
      if (state.operationStatus === 'create') {
        await saveSysFileUsed(form)
        message.success('新增文件用途成功')
      } else {
        await updateSysFileUsed(editingId.value, form)
        message.success('修改文件用途成功')
      }
      emits('success')
      close()
    } catch (error) {
      // 失败提示由请求拦截器给出，保留弹窗内容便于调整后重试
      console.error('文件用途保存失败:', error)
    } finally {
      state.loadingStatus = false
    }
  })
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    v-model="state.visibleStatus"
    :before-close="close"
    :close-on-click-modal="false"
    :show-close="!state.loadingStatus"
    :title="state.title"
    append-to-body
  >
    <el-form
      ref="formRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="sysFileUsedOperationRules"
      inline-message
      label-width="100px"
      scroll-to-error
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="用途编码" prop="usedCode">
            <el-input
              v-model="addUpdateForm.usedCode"
              :disabled="state.operationStatus === 'update'"
              :maxlength="32"
              placeholder="请输入用途编码 如 contract，创建后不可修改"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用途名称" prop="usedName">
            <el-input v-model="addUpdateForm.usedName" :maxlength="30" placeholder="请输入用途名称 如 合同附件" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用途状态" prop="usedEnabled">
            <xht-enum-select v-model="addUpdateForm.usedEnabled" :data="fileUsedEnabledEnum" clearable placeholder="请选择用途状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用途排序" prop="usedSort">
            <el-input-number
              v-model="addUpdateForm.usedSort"
              :min="0"
              :max="9999"
              class="w-full!"
              value-on-clear="min"
              placeholder="请输入用途排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明" prop="usedDesc">
            <el-input
              v-model="addUpdateForm.usedDesc"
              :maxlength="200"
              :rows="5"
              placeholder="用途说明"
              resize="none"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :loading="state.loadingStatus" type="primary" @click="submit">提 交</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
