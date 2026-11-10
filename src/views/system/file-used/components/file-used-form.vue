<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysFileUsedById, saveSysFileUsed, updateSysFileUsed } from '@/service/api/system/file-used.api'
import { fileAccessScopeEnum, fileImageModeEnum, fileWatermarkLevelEnum } from '@/service/enums/system/file.enum'
import type { SysFileUsedOperationRequest } from '@/service/model/system/file-used.model'
import { sysFileUsedOperationForm, sysFileUsedOperationRules } from '@/views/system/file-used/file-used.data'

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
        usedCode: data.usedCode,
        usedName: data.usedName,
        description: data.description ?? '',
        enabled: data.enabled,
        sort: data.sort,
        accessScope: data.accessScope,
        publicAllowed: data.publicAllowed,
        downloadAllowed: data.downloadAllowed,
        printAllowed: data.printAllowed,
        shareAllowed: data.shareAllowed,
        shareExpireDays: data.shareExpireDays ?? null,
        shareMaxAccessCount: data.shareMaxAccessCount ?? null,
        watermarkLevel: data.watermarkLevel,
        imageMode: data.imageMode ?? null,
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
 * 关闭「允许公开」属高风险操作：需二次确认，取消则回滚开关
 */
const handlePublicAllowedChange = async (value: string | number | boolean) => {
  if (value) return
  try {
    await useMessageBox().confirm('关闭后该用途下已设为公开的文件将不再允许匿名访问, 是否继续?')
  } catch {
    // 用户取消：把开关拨回开启状态
    state.addUpdateForm.publicAllowed = 1
  }
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
        usedCode: state.addUpdateForm.usedCode.trim(),
        usedName: state.addUpdateForm.usedName.trim(),
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
    align-center
    append-to-body
    width="680px"
  >
    <el-form
      ref="formRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="sysFileUsedOperationRules"
      inline-message
      label-width="120px"
      scroll-to-error
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="用途编码" prop="usedCode">
            <el-input
              v-model="addUpdateForm.usedCode"
              :disabled="state.operationStatus === 'update'"
              :maxlength="32"
              placeholder="如 contract，创建后不可修改"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用途名称" prop="usedName">
            <el-input v-model="addUpdateForm.usedName" :maxlength="30" placeholder="如 合同附件" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="说明" prop="description">
        <el-input
          v-model="addUpdateForm.description"
          :maxlength="200"
          :rows="5"
          placeholder="用途说明"
          resize="none"
          show-word-limit
          type="textarea"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="启用状态">
            <el-switch v-model="addUpdateForm.enabled" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="addUpdateForm.sort" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="默认访问范围">
            <xht-enum-select v-model="addUpdateForm.accessScope" :data="fileAccessScopeEnum" placeholder="请选择访问范围" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="允许公开">
            <el-switch v-model="addUpdateForm.publicAllowed" :active-value="1" :inactive-value="0" @change="handlePublicAllowedChange" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="允许下载">
            <el-switch v-model="addUpdateForm.downloadAllowed" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="允许打印">
            <el-switch v-model="addUpdateForm.printAllowed" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="允许分享">
            <el-switch v-model="addUpdateForm.shareAllowed" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="水印等级">
            <xht-enum-select v-model="addUpdateForm.watermarkLevel" :data="fileWatermarkLevelEnum" placeholder="请选择水印等级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图片模式">
            <xht-enum-select v-model="addUpdateForm.imageMode" :data="fileImageModeEnum" clearable placeholder="留空继承全局" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="默认分享天数">
            <el-input-number v-model="addUpdateForm.shareExpireDays" :min="1" :max="3650" placeholder="留空继承全局" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分享访问上限">
            <el-input-number v-model="addUpdateForm.shareMaxAccessCount" :min="0" :max="999999" placeholder="留空继承全局" />
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
