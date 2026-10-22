<script setup lang="ts">
import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'
import { isAuthorized, type AuthorizationScope } from '@/utils/authorization'
import type { XhtAuthorizationProps } from '@/components/xht-authorization/types'

defineOptions({
  name: 'XhtAuthorization',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<XhtAuthorizationProps>(), {
  modifiers: undefined,
  args: 'all',
})
const { userInfo, isAdmin } = storeToRefs(useUserInfoStore())

/**
 * 权限来源：未指定修饰符时同时比对角色编码与按钮编码
 */
const scope = computed<AuthorizationScope>(() => props.modifiers ?? 'both')

/**
 * 是否隐藏插槽内容
 */
const isHidden = computed<boolean>(
  () =>
    !isAuthorized({
      required: props.authorization,
      roleCodes: userInfo.value.roleCodes,
      buttonCodes: userInfo.value.menuButtonCodes,
      scope: scope.value,
      mode: props.args,
      isAdmin: isAdmin.value,
    })
)
</script>

<template>
  <slot v-if="!isHidden" />
</template>

<style scoped lang="scss"></style>
