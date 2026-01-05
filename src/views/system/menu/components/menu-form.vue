<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { querySysMenuById, saveSysMenu, updateSysMenu } from '@/service/api/system/menu.api'
import { useMessage } from '@/hooks/use-message'
import { MenuCommonStatus, SysMenuOperationRequest } from '@/service/model/system/menu.model'
import { MenuStatusEnums, MenuTypeEnums } from '@/service/model/system/menu.model'
import { SysMenuOperationForm, SysMenuOperationRules } from '@/views/system/menu/menu.data'
import type { ModeIdType } from '@/service/model/base.model'

defineOptions({
  name: 'MenuForm',
})

const emit = defineEmits(['success'])
const addUpdateFormRef = useTemplateRef<FormInstance>('addUpdateFormRef')
const rules: FormRules = SysMenuOperationRules
const state = reactive<AddUpdateOption<SysMenuOperationRequest>>({
  title: '增加部门',
  visibleStatus: false,
  operationStatus: 'create',
  loadingStatus: false,
  addUpdateForm: { ...SysMenuOperationForm },
})
const { addUpdateForm } = toRefs(state)
const isM = computed(() => addUpdateForm.value.menuType === MenuTypeEnums.M)
const isC = computed(() => addUpdateForm.value.menuType === MenuTypeEnums.C)
const isB = computed(() => addUpdateForm.value.menuType === MenuTypeEnums.B)
const isCAndFrameFlag = computed(() => isC.value && addUpdateForm.value.frameFlag === MenuCommonStatus.NO)

/**
 * 打开显示
 */
const show = async (type: 'create' | 'update', id: ModeIdType) => {
  try {
    state.visibleStatus = true
    state.operationStatus = type
    state.loadingStatus = true
    if (type === 'update') {
      state.title = '修改菜单'
      const { data } = await querySysMenuById(id)
      addUpdateForm.value = data
    }
  } finally {
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
          await saveSysMenu(addUpdateForm.value)
          useMessage().success('新增数据成功')
        } else {
          await updateSysMenu(addUpdateForm.value)
          useMessage().success('修改数据成功')
        }
        emit('success')
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
  addUpdateForm.value = { ...SysMenuOperationForm }
  state.visibleStatus = false
  state.operationStatus = 'create'
  state.loadingStatus = false
  addUpdateFormRef.value?.resetFields()
}

/**
 * 组件发生变化
 */
const handlerChange = () => {
  if (addUpdateForm.value.frameFlag === MenuCommonStatus.YES) {
    addUpdateForm.value.menuHidden = MenuCommonStatus.YES
  }
  if (addUpdateForm.value.menuHidden === MenuCommonStatus.NO) {
    addUpdateForm.value.menuCache = MenuCommonStatus.NO
    addUpdateForm.value.affixStatus = MenuCommonStatus.NO
  }
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
      label-width="100px"
      scroll-to-error
    >
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="上级菜单" prop="parentId">
            <menu-tree-select v-model="addUpdateForm.parentId" :id="addUpdateForm.id" show-top-menu :type="isB ? 'M' : 'C'" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-select v-model="addUpdateForm.menuType" clearable placeholder="请选择菜单类型">
              <el-option :value="MenuTypeEnums.M" label="目录" />
              <el-option :value="MenuTypeEnums.C" label="菜单" />
              <el-option :value="MenuTypeEnums.B" label="按钮" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="addUpdateForm.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="菜单状态" prop="menuStatus">
            <el-select v-model="addUpdateForm.menuStatus" clearable placeholder="请选择菜单状态">
              <el-option :value="MenuStatusEnums.NORMAL" label="正常" />
              <el-option :value="MenuStatusEnums.DISABLE" label="停用" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!isB">
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="菜单图标" prop="menuIcon">
            <icon-select v-model="addUpdateForm.menuIcon" placeholder="请输入菜单图标" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="路由地址" prop="menuPath">
            <el-input v-model="addUpdateForm.menuPath" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col v-if="!isM" :lg="12" :sm="24" :xs="24">
          <el-form-item label="权限标识" prop="menuAuthority">
            <el-input v-model="addUpdateForm.menuAuthority" placeholder="请输入权限标识" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="菜单排序" prop="menuSort">
            <el-input-number v-model="addUpdateForm.menuSort" :max="999" :min="1" class="w100!" placeholder="请输入菜单排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isCAndFrameFlag">
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="组件名称" prop="viewName">
            <el-input v-model="addUpdateForm.viewName" placeholder="请输入组件名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :sm="24" :xs="24">
          <el-form-item label="组件路径" prop="viewPath">
            <el-input v-model="addUpdateForm.viewPath" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="isCAndFrameFlag" :lg="12" :sm="24" :xs="24">
          <el-form-item label="显示状态" prop="menuHidden">
            <el-switch
              @change="handlerChange"
              v-model="addUpdateForm.menuHidden"
              :active-value="MenuCommonStatus.YES"
              :inactive-value="MenuCommonStatus.NO"
              active-text="显示"
              inactive-text="隐藏"
              inline-prompt
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isC && addUpdateForm.menuHidden === MenuCommonStatus.NO" :lg="12" :sm="24" :xs="24">
          <el-form-item label="高亮菜单" prop="activeMenuPath">
            <el-input v-model="addUpdateForm.activeMenuPath" placeholder="请输入高亮菜单" />
          </el-form-item>
        </el-col>
        <el-col
          v-if="isC && addUpdateForm.menuHidden === MenuCommonStatus.YES && addUpdateForm.frameFlag === MenuCommonStatus.NO"
          :lg="12"
          :sm="24"
          :xs="24"
        >
          <el-form-item label="缓存状态" prop="menuCache">
            <el-switch
              v-model="addUpdateForm.menuCache"
              :active-value="MenuCommonStatus.YES"
              :inactive-value="MenuCommonStatus.NO"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="isC && addUpdateForm.menuHidden === MenuCommonStatus.YES && addUpdateForm.frameFlag === MenuCommonStatus.NO"
          :lg="12"
          :sm="24"
          :xs="24"
        >
          <el-form-item label="tag固定" prop="affixStatus">
            <el-switch
              class="w-100!"
              v-model="addUpdateForm.affixStatus"
              :active-value="MenuCommonStatus.YES"
              :inactive-value="MenuCommonStatus.NO"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isC" :lg="12" :sm="24" :xs="24">
          <el-form-item label="外链" prop="frameFlag">
            <el-switch
              @change="handlerChange"
              v-model="addUpdateForm.frameFlag"
              :active-value="MenuCommonStatus.YES"
              :inactive-value="MenuCommonStatus.NO"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
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

<style scoped></style>
