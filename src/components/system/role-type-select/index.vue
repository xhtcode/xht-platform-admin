<script setup lang="ts">
import type { RoleTypeSelectProps } from '@/components/system/role-type-select/types'
import type { SysRoleTypeOption } from '@/service/model/system/role-type.model'
import { querySysRoleTypeList } from '@/service/api/system/role-type.api'

defineOptions({ name: 'RoleTypeSelect' })

const props = withDefaults(defineProps<RoleTypeSelectProps>(), {
  clearable: false, // 默认不可清空：角色分类为必填项
  disabled: false, // 是否禁用
  placeholder: '请选择角色分类',
  fallbackLabel: '',
})

const modelValue = defineModel<ModeIdType>('modelValue')
const options = ref<SysRoleTypeOption[]>([])

/**
 * 下拉数据，兼容"已绑定类型被停用后不在正常列表"的场景，避免编辑时回显为空
 */
const selectOptions = computed<SysRoleTypeOption[]>(() => {
  if (!modelValue.value || !props.fallbackLabel) return options.value
  if (options.value.some((item) => item.id === modelValue.value)) return options.value
  return [{ id: modelValue.value, typeCode: '', typeName: props.fallbackLabel }, ...options.value]
})

/**
 * 查询角色分类列表（仅正常状态）
 */
const handleQuery = () => {
  querySysRoleTypeList()
    .then((res) => {
      options.value = res.data || []
    })
    .catch((error) => {
      console.error('角色分类列表查询失败:', error)
    })
}

onMounted(() => {
  handleQuery()
})

defineExpose({
  refresh: handleQuery,
})
</script>

<template>
  <el-select v-model="modelValue" :clearable="props.clearable" :disabled="props.disabled" :placeholder="props.placeholder" class="w-full">
    <el-option v-for="item in selectOptions" :key="item.id" :label="item.typeName" :value="item.id">
      <span>{{ item.typeName }}</span>
      <span v-if="item.typeCode" class="role-type-code">{{ item.typeCode }}</span>
    </el-option>
    <template #empty>暂无可选角色分类，请先到角色分类管理中新增</template>
  </el-select>
</template>

<style scoped lang="scss">
.role-type-code {
  float: right;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-extra-small);
}
</style>
