<script lang="ts" setup>
import { queryBLogById } from '@/service/api/monitor/blog.api'
import type { BLogResponse } from '@/service/model/monitor/blog.model'
import { bLogExecuteStatusEnum } from '@/service/enums/monitor/blog.enum'

defineOptions({ name: 'BLogDetail' })

const state = reactive({
  visibleStatus: false, // 抽屉可见状态
  loadingStatus: false, // 加载状态
  logInfo: {} as BLogResponse, // 日志详情
})

/**
 * 请求头信息解析结果（JSON 键值对）：内容要么为空，要么是扁平的 JSON 对象
 */
const requestHeaderEntries = computed<Record<any, any>>(() => {
  const raw = state.logInfo.requestHeaders
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
})

/**
 * 调用参数解析结果：结构为 { 参数名: { type: 类型, value: 参数值 } }
 * 解析失败时返回 null，由模板降级展示原始文本
 */
const requestParamEntries = computed<Record<any, any> | null>(() => {
  const raw = state.logInfo.requestParams
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
})

/**
 * 调用参数降级文本：有内容但无法按标准结构解析时，展示原始/美化文本
 */
const requestParamFallbackText = computed<string>(() => {
  const raw = state.logInfo.requestParams
  if (!raw) return ''
  const parsed = requestParamEntries.value
  if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return ''
  try {
    let data = JSON.parse(raw)
    if (typeof data === 'string') data = JSON.parse(data)
    if (data && typeof data === 'object') return JSON.stringify(data, null, 2)
    return String(data)
  } catch {
    return raw
  }
})

/**
 * 提取单个参数的类型与格式化值，兼容参数值不是 {type, value} 结构的情况
 */
const getParamInfo = (param: any): { type: string; valueText: string } => {
  if (param && typeof param === 'object' && !Array.isArray(param)) {
    return { type: typeof param.type === 'string' ? param.type : '', valueText: formatParamValue(param.value) }
  }
  return { type: '', valueText: formatParamValue(param) }
}

/**
 * 格式化调用参数的值：对象/数组美化缩进，空值显示暂无
 */
const formatParamValue = (value: any): string => {
  if (value === null || value === undefined) return '暂无'
  if (typeof value === 'object') {
    const text = JSON.stringify(value, null, 2)
    return text === '{}' || text === '[]' ? '暂无' : text
  }
  return String(value)
}

/**
 * 打开显示
 *
 * @param row 日志列表行数据
 */
const show = async (row: BLogResponse) => {
  state.visibleStatus = true
  state.loadingStatus = true
  state.logInfo = row
  try {
    const { data } = await queryBLogById(row.id)
    state.logInfo = data
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 关闭
 */
const close = () => {
  if (state.loadingStatus) return
  state.logInfo = {} as BLogResponse
  state.visibleStatus = false
}

defineExpose({
  show,
})
</script>

<template>
  <el-drawer v-model="state.visibleStatus" title="日志详情" size="60%" append-to-body :close-on-click-modal="false" :before-close="close">
    <div v-loading="state.loadingStatus" element-loading-text="拼命加载中">
      <el-descriptions :column="2" border label-width="120">
        <el-descriptions-item label="服务名称" :span="2">{{ state.logInfo.serviceName }}</el-descriptions-item>
        <el-descriptions-item label="日志模块" :span="2">
          <el-space>
            <xht-enum-tag :filter-label="state.logInfo.executeStatus" :data="bLogExecuteStatusEnum" />
            <span>{{ state.logInfo.title }}</span>
            <span>{{ state.logInfo.logDesc }}</span>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item label="链路ID" :span="2">
          <span>{{ state.logInfo.traceId || '暂无' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="执行方法" :span="2">{{ state.logInfo.classMethod }}</el-descriptions-item>
        <el-descriptions-item label="执行账号" :span="2">{{ state.logInfo.executeAccount }}</el-descriptions-item>
        <el-descriptions-item label="请求地址" :span="2">
          <el-space>
            <el-tag v-if="state.logInfo.requestType" type="primary" effect="dark">{{ state.logInfo.requestType }}</el-tag>
            <div>{{ state.logInfo.requestUrl || '暂无' }}</div>
          </el-space>
        </el-descriptions-item>
        <el-descriptions-item label="请求IP" label-align="center">{{ state.logInfo.requestIp }}</el-descriptions-item>
        <el-descriptions-item label="服务器地址" label-align="center">{{ state.logInfo.serverAddr }}</el-descriptions-item>
        <el-descriptions-item label="执行时间" label-align="center">{{ state.logInfo.executeTime }}</el-descriptions-item>
        <el-descriptions-item label="执行耗时" label-align="center">
          <span v-if="state.logInfo.executeCost !== null && state.logInfo.executeCost !== undefined">{{ state.logInfo.executeCost }} ms</span>
          <span v-else>暂无</span>
        </el-descriptions-item>
        <el-descriptions-item label="请求头信息" :span="2" class-name="p-0!">
          <el-descriptions v-if="requestHeaderEntries" :column="1" border :label-width="120" size="small">
            <el-descriptions-item v-for="[key, value] in Object.entries(requestHeaderEntries)" :key="key" :label="key" label-align="right">
              <span class="break-all">{{ value }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <span v-else>暂无</span>
        </el-descriptions-item>
        <el-descriptions-item label="调用参数" :span="2" class-name="p-0!">
          <el-descriptions
            v-if="requestParamEntries && Object.keys(requestParamEntries).length > 0"
            :column="1"
            border
            :label-width="60"
            size="small"
          >
            <el-descriptions-item v-for="(param, key) in requestParamEntries" :key="key" :label="key" label-align="right">
              <div class="param-item">
                <span class="param-type">{{ getParamInfo(param).type || '暂无类型' }}</span>
                <pre>{{ getParamInfo(param).valueText }}</pre>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <span v-else>暂无</span>
        </el-descriptions-item>
        <el-descriptions-item label="执行异常信息" :span="2" v-if="state.logInfo.executeStatus === bLogExecuteStatusEnum.ERROR.value">
          {{ state.logInfo.executeException }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button :disabled="state.loadingStatus" @click="close">关闭</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.param-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-type {
  align-self: flex-start;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}
</style>
