<template>
  <div class="user-info-container layout-header-top-item">
    <el-dropdown trigger="click">
      <div class="avatar-container flex-center">
        <div class="flex-center">
          <el-avatar alt="avatar" class="avatar-image user-select-none" :src="aa" />
        </div>
        <div class="user-select-none">
          小糊涂胡须撒旦
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
            <span class="user-select-none"> 退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { CaretBottom, List, Lock, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import aa from '@/assets/images/title-boy.jpg'

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
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '@/styles/theme/layout' with (
  $header-item-width: auto
);

.user-info-container {
  .avatar-container {
    height: 100%;
    line-height: layout.$header-height;
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
