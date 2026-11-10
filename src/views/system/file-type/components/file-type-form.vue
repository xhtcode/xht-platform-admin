<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/use-message'
import { querySysFileTypeById, saveSysFileType, updateSysFileType } from '@/service/api/system/file-type.api'
import { filePreviewSourceEnum, filePreviewTypeEnum } from '@/service/enums/system/file.enum'
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
 * 表单校验规则
 *
 * `convertTarget` 的必填判定依赖当前预览来源，必须在组件内追加动态规则才能读到最新表单值。
 */
const rules = computed<FormRules>(() => ({
  ...sysFileTypeOperationRules,
  convertTarget: [
    {
      validator: (_rule, value, callback) => {
        if (addUpdateForm.value.previewSource !== 'convert') {
          callback()
          return
        }
        if (!value) {
          callback(new Error('预览来源为转换产物时必须填写转换目标格式'))
          return
        }
        callback()
      },
      trigger: 'change',
    },
  ],
}))

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
 * 预览来源变更：切回「原文件」时清空转换目标，避免残留无效配置
 */
const handlePreviewSourceChange = () => {
  if (addUpdateForm.value.previewSource !== 'convert') {
    addUpdateForm.value.convertTarget = null
  }
}

/**
 * 后缀输入归一化
 *
 * 去掉前缀点、首尾空格并转小写，空值统一置为 null（空串会入库为 ''，后续再建会命中唯一索引）。
 */
const handleFileSuffixBlur = () => {
  const fileSuffix = addUpdateForm.value.fileSuffix?.trim().replace(/^\.+/, '').toLowerCase()
  addUpdateForm.value.fileSuffix = fileSuffix ? fileSuffix : null
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
        previewSource: data.previewSource ?? 'original',
        convertTarget: data.convertTarget ?? null,
        enabled: data.enabled ?? 1,
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
      // 后缀整体覆盖语义：空值传 null，避免写入空串；转换目标同理
      const form: SysFileTypeOperationRequest = {
        ...addUpdateForm.value,
        fileSuffix: addUpdateForm.value.fileSuffix?.trim() || null,
        convertTarget: addUpdateForm.value.previewSource === 'convert' ? addUpdateForm.value.convertTarget || null : null,
      }
      if (state.operationStatus === 'create') {
        await saveSysFileType(form)
        useMessage().success('新增预览类型配置成功')
      } else {
        await updateSysFileType(form)
        useMessage().success('修改预览类型配置成功')
      }
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
    align-center
    append-to-body
  >
    <el-form
      ref="addUpdateFormRef"
      v-loading="state.loadingStatus"
      :model="addUpdateForm"
      :rules="rules"
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
        <el-input v-model="addUpdateForm.previewName" :maxlength="30" placeholder="请输入预览类型名称" show-word-limit />
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input
          v-model="addUpdateForm.fileSuffix"
          :maxlength="30"
          placeholder="如 jpg，留空表示该预览类型的默认名称配置"
          show-word-limit
          @blur="handleFileSuffixBlur"
        />
        <div class="form-tip">单个后缀且不带点；留空即创建该预览类型的默认名称配置，同一后缀只能属于一种预览类型。</div>
      </el-form-item>
      <el-form-item label="预览来源" prop="previewSource">
        <xht-enum-select
          v-model="addUpdateForm.previewSource"
          :data="filePreviewSourceEnum"
          placeholder="请选择预览来源"
          @change="handlePreviewSourceChange"
        />
      </el-form-item>
      <el-form-item label="转换目标" prop="convertTarget">
        <el-input
          :model-value="addUpdateForm.convertTarget ?? ''"
          :disabled="addUpdateForm.previewSource !== 'convert'"
          :maxlength="20"
          placeholder="目前仅支持 pdf"
          @update:model-value="addUpdateForm.convertTarget = $event ? String($event) : null"
        />
        <div class="form-tip">仅「转换产物」来源需要填写，目前后端只支持转换为 pdf。</div>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          :model-value="addUpdateForm.enabled ?? 0"
          :active-value="1"
          :inactive-value="0"
          @update:model-value="addUpdateForm.enabled = Number($event)"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          :model-value="addUpdateForm.sort ?? undefined"
          :min="0"
          :max="9999"
          @update:model-value="addUpdateForm.sort = $event ?? null"
        />
      </el-form-item>
      <el-form-item v-if="addUpdateForm.previewType === 'image'" label="图片模式">
        <span class="form-tip is-inline">图片处理模式（原图 / WebP / PDF）由文件用途配置决定，不在该表维护。</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">取 消</el-button>
      <el-button :loading="state.loadingStatus" type="primary" @click="submitForm">提 交</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-tip {
  width: 100%;
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.form-tip.is-inline {
  margin-top: 0;
}
</style>
