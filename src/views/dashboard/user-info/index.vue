<script setup lang="ts">
import { userStatusEnums } from '@/service/enums/system/user.enum'

defineOptions({
  name: 'UserInfo',
})
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
// 模拟用户数据
const userData = reactive({
  userId: 1,
  userName: 'admin',
  nickName: '管理员',
  userPhone: '13800138000',
  userAvatar: '',
  userStatus: userStatusEnums.NORMAL.value,
  registerDate: '2024-01-01',
  dataScope: 1,
  userType: '1',
  // 部门岗位关联列表（支持多部门多岗位）
  deptPostList: [
    {
      deptId: 1,
      deptName: '技术部',
      deptManager: '张三',
      deptPhone: '010-88888888',
      posts: [
        {
          postId: 1,
          postName: '高级开发工程师',
          postCode: 'DEV_SENIOR',
        },
        {
          postId: 2,
          postName: '架构师',
          postCode: 'ARCHITECT',
        },
      ],
    },
    {
      deptId: 2,
      deptName: '产品部',
      deptManager: '李四',
      deptPhone: '010-88888889',
      posts: [
        {
          postId: 3,
          postName: '产品经理',
          postCode: 'PRODUCT_MANAGER',
        },
      ],
    },
    {
      deptId: 3,
      deptName: '市场部',
      deptManager: '王五',
      deptPhone: '010-88888890',
      posts: [
        {
          postId: 7,
          postName: '市场专员',
          postCode: 'MARKET_SPECIALIST',
        },
        {
          postId: 10,
          postName: '项目经理',
          postCode: 'PROJECT_MANAGER',
        },
      ],
    },
  ],
})

// 是否处于编辑模式
const isEditMode = ref(false)

// 编辑表单数据
const editForm = reactive({
  nickName: userData.nickName,
  userPhone: userData.userPhone,
  userAvatar: userData.userAvatar,
})

// 数据范围映射
const dataScopeMap: Record<number, string> = {
  1: '全部数据权限',
  2: '自定数据权限',
  3: '本部门数据权限',
  4: '本部门及以下数据权限',
  5: '仅本人数据权限',
}

// 进入编辑模式
const enterEditMode = () => {
  // 初始化编辑表单数据
  editForm.nickName = userData.nickName
  editForm.userPhone = userData.userPhone
  editForm.userAvatar = userData.userAvatar
  isEditMode.value = true
}

// 保存编辑
const saveEdit = () => {
  // 模拟保存操作
  userData.nickName = editForm.nickName
  userData.userPhone = editForm.userPhone
  userData.userAvatar = editForm.userAvatar

  // 显示保存成功消息
  ElMessage.success('保存成功')

  // 退出编辑模式
  isEditMode.value = false
}

// 取消编辑
const cancelEdit = () => {
  isEditMode.value = false
}
</script>

<template>
  <div class="xht-view-container user-select-none">
    <!-- 用户详细信息标题 -->
    <el-divider content-position="left">
      <h3 class="font-bold">用户详细信息</h3>
    </el-divider>
    <!-- 个人信息卡片 -->
    <div class="rounded-lg">
      <!-- 头部信息 -->
      <div class="flex items-center p-[10px]">
        <div class="flex-center flex-[1]">
          <el-avatar :size="120" :src="userData.userAvatar">
            {{ userData.nickName?.charAt(0) || 'U' }}
          </el-avatar>
        </div>
        <div class="flex-[3]">
          <div class="mb-2 flex items-center justify-between">
            <h2 class="m-0 text-2xl text-gray-800 font-bold">{{ userData.nickName || userData.userName || '未知用户' }}</h2>
            <div class="flex gap-2">
              <el-button v-if="!isEditMode" type="primary" size="small" @click="enterEditMode">编辑</el-button>
              <template v-else>
                <el-button type="success" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </template>
            </div>
          </div>
          <p class="m-0 mb-3 text-sm text-gray-600">账号：{{ userData.userName }}</p>
          <div class="flex flex-wrap items-center gap-4">
            <xht-enum-tag :filter-label="userData.userStatus" :data="userStatusEnums" />
            <span class="text-xs text-gray-500">注册日期：{{ userData.registerDate || '未知' }}</span>
          </div>
        </div>
      </div>

      <!-- 用户详细信息内容 -->
      <div class="grid grid-cols-3 gap-x-5 gap-y-1">
        <div class="h-10 min-h-[40px] flex items-center gap-4">
          <div class="w-20 text-right text-gray-600 font-bold">手机号</div>
          <div class="flex-1">
            <template v-if="!isEditMode">
              <div class="h-full flex items-center">{{ userData.userPhone || '-' }}</div>
            </template>
            <template v-else>
              <el-input v-model="editForm.userPhone" placeholder="请输入手机号" size="small" class="h-9"></el-input>
            </template>
          </div>
        </div>
        <div class="h-10 min-h-[40px] flex items-center gap-4">
          <div class="w-20 text-right text-gray-600 font-bold">数据范围</div>
          <div class="flex flex-1 items-center">{{ dataScopeMap[userData.dataScope as number] || '-' }}</div>
        </div>
        <div class="h-10 min-h-[40px] flex items-center gap-4">
          <div class="w-20 text-right text-gray-600 font-bold">用户类型</div>
          <div class="flex flex-1 items-center">{{ userData.userType || '-' }}</div>
        </div>
        <div class="h-10 min-h-[40px] flex items-center gap-4">
          <div class="w-20 text-right text-gray-600 font-bold">昵称</div>
          <div class="flex-1">
            <template v-if="!isEditMode">
              <div class="h-full flex items-center">{{ userData.nickName || '-' }}</div>
            </template>
            <template v-else>
              <el-input v-model="editForm.nickName" placeholder="请输入昵称" size="small" class="h-9"></el-input>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 部门岗位信息 -->
    <el-divider content-position="left">
      <h3 class="font-bold">部门岗位信息</h3>
    </el-divider>
    <template v-if="userData.deptPostList.length === 0">
      <div class="rounded-lg bg-gray-50 py-4 text-center text-gray-500">暂无部门岗位信息</div>
    </template>
    <template v-else>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="dept in userData.deptPostList" :key="dept.deptId" class="border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-sm">
          <div class="mb-2 text-gray-700 font-medium">{{ dept.deptName }}</div>
          <div class="mb-3 flex justify-between text-sm text-gray-500">
            <div>
              部门主管：
              <span class="text-gray-700 font-medium">{{ dept.deptManager }}</span>
            </div>
            <div>联系电话：{{ dept.deptPhone }}</div>
          </div>
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="post in dept.posts" :key="post.postId" type="primary" size="small">
              {{ post.postName }}
            </el-tag>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
