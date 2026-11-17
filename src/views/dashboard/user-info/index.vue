<script setup lang="ts">
import { Calendar, OfficeBuilding, Postcard } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { userStatusEnum, userTypeEnum } from '@/service/enums/system/user.enum'
import { useUserInfoStore } from '@/store/modules/user.store'
import { useMessage } from '@/hooks/use-message'
import { resolveAvatarUrl } from '@/utils/file'

defineOptions({
  name: 'UserInfo',
})

/**
 * 当前登录用户信息（与顶栏头像同源）
 */
const { userInfo } = storeToRefs(useUserInfoStore())

/**
 * 头像可访问地址（store 中通常是相对路径，需补网关前缀）
 */
const avatarSrc = computed<string>(() => resolveAvatarUrl(userInfo.value.userAvatar))

/**
 * 展示名称（昵称为空时回退用户名）
 */
const displayName = computed<string>(() => userInfo.value.nickName || userInfo.value.userName || '未知用户')

/**
 * 头像无图时展示的首字符
 */
const avatarFallback = computed<string>(() => (userInfo.value.nickName || userInfo.value.userName || 'U').charAt(0))

/**
 * 是否处于编辑模式
 */
const isEditMode = ref(false)

/**
 * 编辑表单数据
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
 * 进入编辑模式（以 store 最新值初始化表单）
 */
const enterEditMode = () => {
  editForm.nickName = userInfo.value.nickName
  editForm.userPhone = userInfo.value.userPhone
  editForm.userAvatar = userInfo.value.userAvatar
  isEditMode.value = true
}

/**
 * 保存编辑（个人资料保存接口待接入，暂写回 store 保证页面与顶栏头像一致）
 */
const saveEdit = () => {
  userInfo.value.nickName = editForm.nickName
  userInfo.value.userPhone = editForm.userPhone
  userInfo.value.userAvatar = editForm.userAvatar
  useMessage().success('保存成功')
  isEditMode.value = false
}

/**
 * 取消编辑
 */
const cancelEdit = () => {
  isEditMode.value = false
}
</script>

<template>
  <div class="xht-view-container user-select-none">
    <div class="user-info-layout">
      <!-- 左侧：个人名片 -->
      <xht-card class="profile-card">
        <div class="profile-body">
          <!-- 头像区：编辑态点击头像打开裁剪弹窗，展示态仅预览 -->
          <div class="profile-head">
            <xht-avatar-upload v-if="isEditMode" v-model="editForm.userAvatar" :size="120" />
            <el-avatar v-else :size="120" :src="avatarSrc">{{ avatarFallback }}</el-avatar>
            <h2 class="profile-name">{{ displayName }}</h2>
            <p class="profile-account">{{ userInfo.userName ? `@${userInfo.userName}` : '-' }}</p>
            <div class="profile-tags">
              <xht-enum-tag :filter-label="userInfo.userStatus" :data="userStatusEnum" />
              <xht-enum-tag :filter-label="userInfo.userType" :data="userTypeEnum" />
            </div>
          </div>

          <el-divider class="my-5!" />

          <!-- 概要信息 -->
          <ul class="profile-meta">
            <li>
              <el-icon :size="14"><OfficeBuilding /></el-icon>
              <span class="profile-meta-label">所属部门</span>
              <span class="profile-meta-value">{{ userInfo.deptName || '-' }}</span>
            </li>
            <li>
              <el-icon :size="14"><Calendar /></el-icon>
              <span class="profile-meta-label">注册日期</span>
              <span class="profile-meta-value">{{ userInfo.registerDate || '-' }}</span>
            </li>
            <li>
              <el-icon :size="14"><Postcard /></el-icon>
              <span class="profile-meta-label">用户编号</span>
              <span class="profile-meta-value">{{ userInfo.userId ?? '-' }}</span>
            </li>
          </ul>

          <!-- 操作区 -->
          <div class="profile-actions">
            <el-button v-if="!isEditMode" type="primary" class="w-full" @click="enterEditMode">编辑资料</el-button>
            <template v-else>
              <el-button type="primary" class="flex-1" @click="saveEdit">保存</el-button>
              <el-button class="flex-1" @click="cancelEdit">取消</el-button>
            </template>
          </div>
        </div>
      </xht-card>

      <!-- 右侧：基本资料 -->
      <xht-card class="detail-card">
        <div class="detail-body">
          <div class="detail-head">
            <span class="detail-title">基本资料</span>
          </div>
          <el-descriptions border :column="2" label-width="100px" class="detail-desc">
            <el-descriptions-item label="用户昵称">
              <el-input v-if="isEditMode" v-model="editForm.nickName" size="small" placeholder="请输入昵称" />
              <span v-else>{{ userInfo.nickName || '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="手机号码">
              <el-input v-if="isEditMode" v-model="editForm.userPhone" size="small" placeholder="请输入手机号" />
              <span v-else>{{ userInfo.userPhone || '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="用户类型">
              <xht-enum-tag :filter-label="userInfo.userType" :data="userTypeEnum" />
            </el-descriptions-item>
            <el-descriptions-item label="数据范围">
              {{ dataScopeMap[userInfo.dataScope as number] || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="账号状态">
              <xht-enum-tag :filter-label="userInfo.userStatus" :data="userStatusEnum" />
            </el-descriptions-item>
            <el-descriptions-item label="注册日期">{{ userInfo.registerDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="所属部门" :span="2">{{ userInfo.deptName || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </xht-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-info-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: stretch;
}

.profile-card {
  flex: 0 0 320px;
  max-width: 100%;
}

.detail-card {
  flex: 1 1 480px;
  min-width: 0;
}

.profile-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 20px 20px;
}

.profile-head {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-name {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  text-align: center;
}

.profile-account {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}

.profile-meta-label {
  color: var(--el-text-color-secondary);
}

.profile-meta-value {
  margin-left: auto;
  color: var(--el-text-color-primary);
  text-align: right;
  word-break: break-all;
}

.profile-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 24px;
}

.detail-body {
  height: 100%;
  padding: 20px;
}

.detail-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.detail-title {
  position: relative;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 3px;
    height: 14px;
    content: '';
    background-color: var(--el-color-primary);
    border-radius: 2px;
    transform: translateY(-50%);
  }
}

.detail-desc {
  // 固定单元格高度：编辑态 small 输入框（24px + 上下 8px 内边距）与展示态文字行高一致，切换不跳动
  :deep(.el-descriptions__cell) {
    height: 40px;
  }
}
</style>
