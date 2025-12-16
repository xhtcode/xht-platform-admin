<script lang="ts" setup>
import { UserStatusColor, UserStatusDesc, UserStatusEnums } from '@/service/model/system/user.model'
import type { UserStatusTagProps } from '@/components/system/user-status-tag/types'

defineOptions({ name: 'UserStatusTag', inheritAttrs: false })
// 定义组件的 props
const props = withDefaults(defineProps<UserStatusTagProps>(), {})
// 根据状态值返回对应的标签颜色
const getTagColor = (status: UserStatusEnums) => {
  return UserStatusColor[status]
}

// 根据状态值返回对应的标签文本
const getStatusLabel = (status: UserStatusEnums) => {
  return UserStatusDesc[status]
}
</script>

<template>
  <el-tag class="user-status-tag" :color="getTagColor(props.status)">
    {{ getStatusLabel(props.status) }}
  </el-tag>
</template>

<style lang="scss" scoped>
.user-status-tag {
  border-width: 0 !important;
  color: #ffffff;
  user-select: none;
}
</style>
