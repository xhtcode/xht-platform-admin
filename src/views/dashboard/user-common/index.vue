<script setup lang="ts">
import { DataLine, List, Lock, Message, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'UserCommon',
})
type UserInfoType = 'UserInfo' | 'PassWord' | 'MyMessage' | 'ToDoWork' | 'LoginLog'
const userInfoComponents: Record<UserInfoType, Component> = {
  UserInfo: defineAsyncComponent(() => import('@/views/dashboard/components/user-info.vue')),
  PassWord: defineAsyncComponent(() => import('@/views/dashboard/components/pass-word.vue')),
  MyMessage: defineAsyncComponent(() => import('@/views/dashboard/components/my-message.vue')),
  ToDoWork: defineAsyncComponent(() => import('@/views/dashboard/components/to-do-work.vue')),
  LoginLog: defineAsyncComponent(() => import('@/views/dashboard/components/login-log.vue')),
}
const activeName = ref<UserInfoType>('UserInfo')
/**
 * 功能切换
 * @param type 功能类型
 */
function handlerClick(type: UserInfoType) {
  activeName.value = type
}
</script>

<template>
  <div class="h-full flex gap-2">
    <div class="xht-view-container-none user-info-container flex-1">
      <div class="user-info-item" :class="activeName === 'UserInfo' ? 'user-info-item-active' : ''" @click="handlerClick('UserInfo')">
        <el-icon><User /></el-icon>
        <span class="flex-1">个人中心</span>
      </div>
      <div class="user-info-item" :class="activeName === 'PassWord' ? 'user-info-item-active' : ''" @click="handlerClick('PassWord')">
        <el-icon><Lock /></el-icon>
        <span>安全设置</span>
      </div>
      <div class="user-info-item" :class="activeName === 'MyMessage' ? 'user-info-item-active' : ''" @click="handlerClick('MyMessage')">
        <el-icon><Message /></el-icon>
        <span class="flex-1">我的信息</span>
        <el-badge :value="3" />
      </div>
      <div class="user-info-item" :class="activeName === 'ToDoWork' ? 'user-info-item-active' : ''" @click="handlerClick('ToDoWork')">
        <el-icon><List /></el-icon>
        <span>待办工作</span>
      </div>
      <div class="user-info-item" :class="activeName === 'LoginLog' ? 'user-info-item-active' : ''" @click="handlerClick('LoginLog')">
        <el-icon><DataLine /></el-icon>
        <span>登录日志</span>
      </div>
    </div>
    <div class="xht-view-container-none flex-[4]">
      <div class="user-select-none text-center text-18px font-bold">个人信息</div>
      <div class="xht-view-main-padding flex-1 overflow-x-hidden overflow-y-auto">
        <component :is="userInfoComponents[activeName]" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;

  .user-info-item {
    width: 100%;
    display: flex;
    gap: 5px;
    align-items: center;
    border: 1px solid var(--xht-border-color);
    border-radius: 8px;
    padding: 10px;
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
  }

  .user-info-item-active {
    color: white;
    background-color: var(--el-color-primary) !important;
  }
}
</style>
