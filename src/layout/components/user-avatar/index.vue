<script lang="ts" setup>
import { CaretBottom, List, Lock, Message, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMessage } from '@/hooks/use-message'

defineOptions({ name: 'UserAvatar' })

const router = useRouter()
const permissions = useUserInfoStore()
const { userInfo } = storeToRefs(permissions)

/**
 * 打开操作
 * @param type
 */
const openDialog = (type: 'userInfo' | 'userSafety' | 'userMessage' | 'loginLog' | 'logout') => {
  switch (type) {
    case 'userInfo':
      routerPath('/user/info')
      break
    case 'userSafety':
      routerPath('/user/safety')
      break
    case 'userMessage':
      routerPath('/user/message')
      break
    case 'loginLog':
      routerPath('/user/login/log')
      break
    case 'logout':
      useMessage().error('暂未实现')
      break
  }
}

/**
 * 路由跳转
 * @param path 路由地址
 */
const routerPath = (path: string) => {
  router.push(path).catch((_) => {
    useMessage().error('路由错误，请联系管理员!')
  })
}
</script>

<template>
  <div class="user-info-container layout-header-top-item pr-5">
    <el-dropdown trigger="click" size="default" @command="openDialog" placement="bottom-end">
      <div class="avatar-container flex-center">
        <div class="flex-center">
          <el-avatar alt="avatar" class="avatar-image user-select-none" :src="userInfo.userAvatar" />
        </div>
        <div class="user-select-none">
          <span class="text-[14px]!">{{ userInfo?.nickName }}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="userInfo">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span class="user-select-none">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item command="userSafety">
            <el-icon>
              <Lock />
            </el-icon>
            <span class="user-select-none">安全设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="userMessage">
            <el-icon>
              <Message />
            </el-icon>
            <span class="user-select-none">我的信息</span>
          </el-dropdown-item>
          <el-dropdown-item command="loginLog">
            <el-icon>
              <List />
            </el-icon>
            <span class="user-select-none">登录日志</span>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <el-icon>
              <switch-button />
            </el-icon>
            <span class="user-select-none">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.user-info-container {
  .avatar-container {
    height: 100%;
    line-height: $header-height;
    white-space: nowrap;
    cursor: pointer;

    .avatar-image {
      width: 22px;
      height: 22px;
      margin-right: 5px !important;
      border-radius: 50%;
    }
  }
}
</style>
