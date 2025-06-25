<template>
  <el-tag :color="getTagColor(status)" hit disable-transitions effect="dark" class="no-border">
    {{ getStatusLabel(status) }}
  </el-tag>
</template>

<script lang="ts" setup>
import { UserStatusEnums } from '@/model/system/user.model'
defineOptions({ name: 'UserStatusDict' })
// 定义组件的 props
const props = defineProps({
  status: {
    type: Number,
    required: true,
  },
})
// 根据状态值返回对应的标签颜色
const getTagColor = (status: UserStatusEnums) => {
  switch (status) {
    case UserStatusEnums.NORMAL:
      return '#67c23a' // 绿色
    case UserStatusEnums.DISABLE:
      return '#909399' // 灰色
    case UserStatusEnums.LOCKED:
      return '#e6a23c' // 橙色
    case UserStatusEnums.EXPIRED:
      return '#f56c6c' // 红色
    case UserStatusEnums.FORBIDDEN:
      return '#f56c6c' // 红色
    case UserStatusEnums.UNREGISTER:
      return '#909399' // 灰色
    case UserStatusEnums.OTHER:
      return '#909399' // 灰色
    default:
      return ''
  }
}

// 根据状态值返回对应的标签文本
const getStatusLabel = (status: UserStatusEnums) => {
  switch (status) {
    case UserStatusEnums.NORMAL:
      return '正常状态'
    case UserStatusEnums.DISABLE:
      return '禁用状态'
    case UserStatusEnums.LOCKED:
      return '锁定状态'
    case UserStatusEnums.EXPIRED:
      return '过期状态'
    case UserStatusEnums.FORBIDDEN:
      return '禁止登录状态'
    case UserStatusEnums.UNREGISTER:
      return '未注册状态'
    case UserStatusEnums.OTHER:
      return '其他状态'
    default:
      return '未知状态'
  }
}
</script>
