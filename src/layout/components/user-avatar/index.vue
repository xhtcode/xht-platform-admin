<script lang="ts" setup>
import { CaretBottom, List, Lock, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import aa from '@/assets/images/title-boy.jpg'
import { useUserInfoStore } from '@/store/modules/user.store'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'UserAvatar' })

/**
 * 打开操作
 * @param type
 */
const openDialog = (type: 'infoRef' | 'passwordRef' | 'logout') => {
  switch (type) {
    case 'infoRef':
      break
    case 'passwordRef':
      break
    case 'logout':
      break
  }
}

const permissions = useUserInfoStore()
const { userInfo } = storeToRefs(permissions)
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
          <el-dropdown-item @click="openDialog('infoRef')">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span class="user-select-none">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item @click="openDialog('passwordRef')">
            <el-icon>
              <Lock />
            </el-icon>
            <span class="user-select-none">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-icon>
              <List />
            </el-icon>
            <span class="user-select-none">登录日志</span>
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
