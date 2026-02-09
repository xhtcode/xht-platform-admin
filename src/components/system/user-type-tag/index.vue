<script lang="ts" setup>
import { UserTypeTagProps } from '@/components/system/user-type-tag/types'
import { UserTypeEnums } from '@/service/model/system/user.model'

defineOptions({ name: 'UserStatusTag', inheritAttrs: false })
// 定义组件的 props
const props = withDefaults(defineProps<UserTypeTagProps>(), {})
const userType = computed<string>(() => {
  const result = ''
  switch (props.type) {
    case UserTypeEnums.ADMIN:
      return '管理员'
    case UserTypeEnums.BUSINESS:
      return '商家用户'
    case UserTypeEnums.USER:
      return '普通用户'
  }
  return result
})
</script>

<template>
  <span>{{ userType }}</span>
</template>

<style lang="scss" scoped>
.message-status-tag {
  border-width: 0 !important;
  color: #ffffff;
  user-select: none;
}
</style>
