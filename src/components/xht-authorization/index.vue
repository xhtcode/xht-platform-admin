<script setup lang="ts">
import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'
import { getIntersectionLength } from '@/utils'

defineOptions({
  name: 'XhtAuthorization',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    authorization: string[]
    modifiers?: VAuthorizationModifiers
    args?: VAuthorizationArgs
  }>(),
  {
    modifiers: undefined,
    args: 'all',
  }
)
const permissions = useUserInfoStore()
const { userInfo, isAdmin } = storeToRefs(permissions)
const isShow = computed<boolean>(() => {
  if (isAdmin.value) {
    return false
  }
  let intersection: number = 0
  if (props.modifiers) {
    if (props.modifiers === 'role') {
      intersection += getIntersectionLength(userInfo.value.roleCodes, props.authorization)
    }
    if (props.modifiers === 'button') {
      intersection += getIntersectionLength(userInfo.value.menuButtonCodes, props.authorization)
    }
  } else {
    intersection += getIntersectionLength(userInfo.value.roleCodes, props.authorization)
    intersection += getIntersectionLength(userInfo.value.menuButtonCodes, props.authorization)
  }
  let flag: boolean = false
  switch (props.args) {
    case 'all': // 包含所有
      flag = intersection !== props.authorization?.length
      break
    case 'any': // 包含任意一个以上
      flag = intersection <= 0
      break
    case 'none': // 不包含任意一个
      flag = intersection > 0
      break
  }
  return flag
})
</script>

<template>
  {{ !isShow }}
  <slot name="default" v-if="!isShow" />
</template>

<style scoped lang="scss"></style>
