<script setup lang="ts">
import { querySysNoticeEnableTypeList } from '@/service/api/notice/type.api'
import type { NoticeTypeSelectProps } from '@/components/system/notice-type-select/types'
import type { LabelValue } from '@/service/model/base.model'
import { onMounted } from 'vue'

defineOptions({ name: 'NoticeTypeSelect' })

const props = withDefaults(defineProps<NoticeTypeSelectProps>(), {
  clearable: true, // 是否可以清空选项
  disabled: false, // 是否禁用
  placeholder: '请选择通知类型',
})
const modelValue = defineModel<string>('modelValue')
const options = ref<LabelValue<ModeIdType, string>[]>([])
const handleQuery = () => {
  querySysNoticeEnableTypeList().then((res) => {
    options.value = res.data
  })
}
onMounted(() => {
  handleQuery()
})
</script>

<template>
  <el-select v-model="modelValue" :clearable="props.clearable" :disabled="props.disabled" :placeholder="props.placeholder">
    <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.label" />
  </el-select>
</template>
