<script setup lang="ts">
defineOptions({
  name: 'LoginLog',
})
import type { TimelineItemProps } from 'element-plus'

interface ActivityType extends Partial<TimelineItemProps> {
  content: string
  ip: string
}

const activities: ActivityType[] = [
  {
    content: '登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-15 14:30:22',
    color: '#67C23A',
  },
  {
    content: '登录失败 - 密码错误',
    ip: '192.168.1.1',
    timestamp: '2024-01-15 14:28:15',
    color: '#F56C6C',
  },
  {
    content: '账户锁定 - 连续5次登录失败',
    ip: '192.168.1.1',
    timestamp: '2024-01-15 09:45:33',
    color: '#F56C6C',
  },
  {
    content: '登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-14 19:20:11',
    color: '#67C23A',
    icon: 'CircleCheck',
  },
  {
    content: '登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-13 10:10:05',
    color: '#67C23A',
  },
  {
    content: '登录失败 - 验证码错误',
    ip: '192.168.1.1',
    timestamp: '2024-01-12 18:33:27',
    color: '#F56C6C',
  },
  {
    content: '登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-12 09:15:42',
    color: '#67C23A',
  },
  {
    content: '登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-11 08:50:03',
    color: '#67C23A',
  },
  {
    content: '登录失败 - 账户不存在',
    ip: '192.168.1.1',
    timestamp: '2024-01-10 21:05:19',
    color: '#F56C6C',
  },
  {
    content: '首次登录成功',
    ip: '192.168.1.1',
    timestamp: '2024-01-10 15:30:55',
    color: '#67C23A',
  },
]
</script>

<template>
  <div class="xht-view-container">
    <el-timeline class="w-full!">
      <el-timeline-item placement="top" v-for="(activity, index) in activities" :key="index" :color="activity.color" :timestamp="activity.timestamp">
        <el-descriptions border :column="2" label-width="120px">
          <el-descriptions-item label="登录地址" width="260px">
            <div>{{ activity.ip }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            <div>
              {{ activity.content }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped lang="scss"></style>
