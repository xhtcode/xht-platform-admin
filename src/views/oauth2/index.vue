<script setup lang="ts">
import request from '@/utils/request'
import { onMounted } from 'vue'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'Oauth2',
})
const message = ref<string>('')
const userInfoStore = useUserInfoStore()
const router = useRouter()
/**
 * 初始化Oauth2令牌
 */
const initOauth2Token = () => {
  request({
    url: '/get/token',
  }).then((res) => {
    if (res.data?.token) {
      message.value = '用户已经登录'
      userInfoStore.setAccessToken(res.data.token)
      router.push('/dashboard')
    } else {
      message.value = '用户暂未登录'
      window.location.href = 'http://www.xht.com:8080/authorized'
    }
  })
}
onMounted(() => {
  initOauth2Token()
})
</script>

<template>
  <div class="w-full text-center">{{ message }}</div>
</template>

<style scoped lang="scss"></style>
