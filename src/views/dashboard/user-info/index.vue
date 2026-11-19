<script setup lang="ts">
import { Check, Refresh } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { userStatusEnum, userTypeEnum } from '@/service/enums/system/user.enum'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useMessage } from '@/hooks/use-message'

defineOptions({
  name: 'UserInfo',
})

/**
 * 当前登录用户信息（与顶栏头像同源）
 */
const { userInfo } = storeToRefs(useUserInfoStore())

/**
 * 展示名称（昵称为空时回退用户名）
 */
const displayName = computed<string>(() => userInfo.value.nickName || userInfo.value.userName || '未知用户')

/**
 * 可编辑表单数据（进入页面即以 store 当前值初始化，直接可改）
 */
const editForm = reactive({
  nickName: userInfo.value.nickName,
  userPhone: userInfo.value.userPhone,
  userAvatar: userInfo.value.userAvatar,
})

/**
 * 数据范围映射
 */
const dataScopeMap: Record<number, string> = {
  1: '全部数据权限',
  2: '自定数据权限',
  3: '本部门数据权限',
  4: '本部门及以下数据权限',
  5: '仅本人数据权限',
}

/**
 * 头像上传成功（接口已落库，直接同步到 store，顶栏头像即时更新）
 * @param value 上传接口返回的头像值
 */
const handleAvatarUploaded = (value: string) => {
  userInfo.value.userAvatar = value
}

/**
 * 保存（个人资料保存接口待接入，暂写回 store 保证页面与顶栏头像一致）
 */
const handleSave = () => {
  userInfo.value.nickName = editForm.nickName
  userInfo.value.userPhone = editForm.userPhone
  userInfo.value.userAvatar = editForm.userAvatar
  useMessage().success('保存成功')
}

/**
 * 重置为当前登录用户信息
 */
const handleReset = () => {
  editForm.nickName = userInfo.value.nickName
  editForm.userPhone = userInfo.value.userPhone
  editForm.userAvatar = userInfo.value.userAvatar
}
</script>

<template>
  <div class="h-full flex gap-1">
    <!-- 左侧：个人名片 -->
    <div class="xht-view-container-none user-select-none w-[360px]">
      <div class="profile-body">
        <!-- 头像区：点击头像即可裁剪上传 -->
        <xht-avatar-upload v-model="editForm.userAvatar" :size="120" @upload-success="handleAvatarUploaded" />
        <h2 class="profile-name">{{ displayName }}</h2>

        <el-divider class="my-4!" />

        <!-- 概要信息 -->
        <el-descriptions :column="1" label-width="80px" class="w-full p-1">
          <el-descriptions-item label="用户账号">{{ userInfo.userName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <xht-enum-tag :filter-label="userInfo.userStatus" :data="userStatusEnum" />
          </el-descriptions-item>
          <el-descriptions-item label="用户类型">
            <xht-enum-tag :filter-label="userInfo.userType" :data="userTypeEnum" />
          </el-descriptions-item>
          <el-descriptions-item label="所属部门">{{ userInfo.deptName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="注册日期">{{ userInfo.registerDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="用户编号">{{ userInfo.userId ?? '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 右侧：基本资料表单（直接可编辑） -->
    <div class="xht-view-container user-select-none flex-center flex-1">
      <el-form :model="editForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称">
              <el-input v-model="editForm.nickName" :maxlength="15" placeholder="请输入昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="editForm.userPhone" :maxlength="11" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型">
              <xht-enum-tag :filter-label="userInfo.userType" :data="userTypeEnum" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据范围">
              <span>{{ dataScopeMap[userInfo.dataScope as number] || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号状态">
              <xht-enum-tag :filter-label="userInfo.userStatus" :data="userStatusEnum" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册日期">
              <span>{{ userInfo.registerDate || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门">
              <span>{{ userInfo.deptName || '-' }}</span>
            </el-form-item>
          </el-col>
          <!-- 操作区：表单下方居中 -->
          <el-col :span="24" class="mt-2 text-center">
            <el-button :icon="Check" type="primary" @click="handleSave">保存</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-name {
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  text-align: center;
}
</style>
