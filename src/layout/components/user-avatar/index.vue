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
const openDialog = (type: 'infoRef' | 'passwordRef' | 'logout') => {
  switch (type) {
    case 'infoRef':
      router.push('/user/info').catch((_) => {
        useMessage().error('路由错误，请联系管理员!')
      })
      break
    case 'passwordRef':
      break
    case 'logout':
      break
  }
}
const routerPath = (path: string) => {
  router.push(path).catch((_) => {
    useMessage().error('路由错误，请联系管理员!')
  })
}
</script>

<template>
  <div class="user-info-container layout-header-top-item">
    <el-dropdown trigger="click" size="default">
      <div class="avatar-container flex-center">
        <div class="flex-center">
          <el-avatar alt="avatar" class="avatar-image user-select-none" :src="userInfo.userAvatar" />
        </div>
        <div class="user-select-none">
          {{ userInfo.nickName }}
          <el-icon>
            <CaretBottom />
          </el-icon>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="routerPath('/user/info')">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span class="user-select-none">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item @click="routerPath('/user/safety')">
            <el-icon>
              <Lock />
            </el-icon>
            <span class="user-select-none">安全设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="routerPath('/user/message')">
            <el-icon>
              <Message />
            </el-icon>
            <span class="user-select-none">我的信息</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-icon>
              <List />
            </el-icon>
            <span class="user-select-none" @click="routerPath('/user/login/log')">登录日志</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="openDialog('logout')">
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
      width: 28px;
      height: 28px;
      margin-right: 5px !important;
      border-radius: 50%;
    }
  }
}
</style>
