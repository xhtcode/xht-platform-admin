<script lang="ts" setup>
import { Refresh, RefreshLeft, Select } from '@element-plus/icons-vue'
import { useMessage, useMessageBox } from '@/hooks/use-message'
import { querySysFileSettingList, resetSysFileSetting, updateSysFileSetting } from '@/service/api/system/file-setting.api'
import type { SysFileSettingResponse, SysFileSettingUpdateItem } from '@/service/model/system/file-setting.model'
import { FILE_SETTING_GROUP_LABEL, FILE_SETTING_GROUP_ORDER } from '@/views/system/file-setting/file-setting.data'

defineOptions({ name: 'FileSettingViewIndex' })

const message = useMessage()

const state = reactive({
  loadingStatus: false,
  savingStatus: false,
  activeGroup: '',
  groups: [] as string[],
  // 全部配置项（按 settingKey 索引，便于保存时取 version）
  items: [] as SysFileSettingResponse[],
})

/**
 * 编辑中的值：key → 字符串值（与后端一致，统一按字符串提交）
 */
const draft = reactive<Record<string, string>>({})

/**
 * 当前分组的配置项
 */
const currentItems = computed(() => state.items.filter((item) => item.settingGroup === state.activeGroup))

/**
 * 解析 bool 型配置值
 *
 * @param value 字符串值
 */
const parseBool = (value?: string | null): boolean => value === '1' || value === 'true'

/**
 * 分组的覆盖提示（各配置项提示文案不一致，取第一条非空提示作为分组说明）
 */
const groupHint = computed(() => {
  const hint = currentItems.value.find((item) => item.overrideHint)?.overrideHint
  return hint ?? ''
})

/**
 * 加载配置
 *
 * 拉全量后本地按分组切页签：后端分组固定，一次拉取即可避免切页签重复请求。
 */
const handleQuery = async () => {
  state.loadingStatus = true
  try {
    const { data } = await querySysFileSettingList()
    state.items = data
    // 重建草稿值：以服务端返回的当前值为准，丢弃未保存的修改
    Object.keys(draft).forEach((key) => delete draft[key])
    data.forEach((item) => {
      draft[item.settingKey] = item.settingValue ?? ''
    })
    const groups = Array.from(new Set(data.map((item) => item.settingGroup)))
    state.groups = groups.sort((a, b) => {
      const indexA = FILE_SETTING_GROUP_ORDER.indexOf(a)
      const indexB = FILE_SETTING_GROUP_ORDER.indexOf(b)
      return (indexA === -1 ? FILE_SETTING_GROUP_ORDER.length : indexA) - (indexB === -1 ? FILE_SETTING_GROUP_ORDER.length : indexB)
    })
    if (!state.groups.includes(state.activeGroup)) {
      state.activeGroup = state.groups[0] ?? ''
    }
  } catch (error) {
    // 失败提示由请求拦截器给出，保留上一次数据便于重试
    console.error('文件全局配置查询失败:', error)
  } finally {
    state.loadingStatus = false
  }
}

/**
 * 保存当前分组
 *
 * 必须回传 version（乐观锁），版本冲突时后端拒绝并提示刷新。
 */
const handleSave = async () => {
  if (!currentItems.value.length) return
  state.savingStatus = true
  try {
    const items: SysFileSettingUpdateItem[] = currentItems.value.map((item) => ({
      key: item.settingKey,
      value: draft[item.settingKey] ?? '',
      version: item.version,
    }))
    await updateSysFileSetting(items)
    message.success('配置保存成功')
    await handleQuery()
  } catch (error) {
    // 失败提示由请求拦截器给出（含版本冲突），保留当前编辑内容
    console.error('文件全局配置保存失败:', error)
  } finally {
    state.savingStatus = false
  }
}

/**
 * 恢复当前分组默认值
 */
const handleReset = () => {
  if (!currentItems.value.length) return
  useMessageBox()
    .confirm(`此操作将把「${FILE_SETTING_GROUP_LABEL[state.activeGroup] ?? state.activeGroup}」分组恢复为默认值, 是否继续?`)
    .then(async () => {
      state.savingStatus = true
      await resetSysFileSetting(currentItems.value.map((item) => item.settingKey))
      await handleQuery()
      message.success('已恢复默认配置')
    })
    .catch(() => {
      // 取消或失败（失败提示已由拦截器给出）
    })
    .finally(() => {
      state.savingStatus = false
    })
}

/**
 * 放弃未保存的修改，回到服务端当前值
 */
const handleDiscard = () => {
  currentItems.value.forEach((item) => {
    draft[item.settingKey] = item.settingValue ?? ''
  })
  message.info('已重置为当前保存值')
}

onMounted(async () => {
  await handleQuery()
})
</script>

<template>
  <div class="xht-view-container">
    <el-tabs v-if="state.groups.length" v-model="state.activeGroup" class="setting-tabs">
      <el-tab-pane v-for="group in state.groups" :key="group" :label="FILE_SETTING_GROUP_LABEL[group] ?? group" :name="group">
        <div class="setting-toolbar">
          <el-text size="small" type="info">修改后需点击「保存」才会生效，配置项带乐观锁版本号，多人同时修改时会提示刷新。</el-text>
          <el-space>
            <el-button :icon="RefreshLeft" :disabled="state.savingStatus" @click="handleDiscard">撤销修改</el-button>
            <el-button :icon="Refresh" :disabled="state.savingStatus" @click="handleQuery">刷新</el-button>
            <el-button :icon="RefreshLeft" :disabled="state.savingStatus" @click="handleReset">恢复默认</el-button>
            <el-button :icon="Select" :loading="state.savingStatus" type="primary" @click="handleSave">保存</el-button>
          </el-space>
        </div>

        <el-alert v-if="groupHint" class="setting-hint" :closable="false" :title="groupHint" show-icon type="info" />

        <el-form v-loading="state.loadingStatus" label-width="240px" class="setting-form">
          <el-form-item v-for="item in currentItems" :key="item.settingKey" :label="item.settingName">
            <div class="setting-field">
              <el-switch
                v-if="item.valueType === 'bool'"
                :model-value="parseBool(draft[item.settingKey])"
                @update:model-value="draft[item.settingKey] = $event ? '1' : '0'"
              />
              <el-input-number
                v-else-if="item.valueType === 'int'"
                :model-value="draft[item.settingKey] === '' ? undefined : Number(draft[item.settingKey])"
                :max="item.maxValue ? Number(item.maxValue) : undefined"
                :min="item.minValue ? Number(item.minValue) : undefined"
                class="setting-number"
                @update:model-value="draft[item.settingKey] = $event === undefined || $event === null ? '' : String($event)"
              />
              <el-input v-else v-model="draft[item.settingKey]" :maxlength="200" class="setting-input" />

              <div class="setting-meta">
                <span class="setting-key">{{ item.settingKey }}</span>
                <span v-if="item.valueType === 'int' && (item.minValue || item.maxValue)" class="setting-range">
                  范围 {{ item.minValue ?? '不限' }} ~ {{ item.maxValue ?? '不限' }}
                </span>
                <span class="setting-default">默认 {{ item.defaultValue }}</span>
              </div>
              <div v-if="item.description" class="setting-desc">{{ item.description }}</div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-empty v-else-if="!state.loadingStatus" description="暂无可配置项" />

    <div v-if="!state.groups.length && state.loadingStatus" v-loading="true" class="setting-loading" />
  </div>
</template>

<style lang="scss" scoped>
.setting-tabs {
  height: 100%;
}

.setting-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.setting-hint {
  margin-bottom: 12px;
}

.setting-form {
  padding-right: 12px;
}

.setting-field {
  width: 100%;
  max-width: 560px;
}

.setting-number {
  width: 180px;
}

.setting-input {
  width: 100%;
}

.setting-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.setting-key {
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.setting-desc {
  margin-top: 2px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.setting-loading {
  height: 240px;
}
</style>
