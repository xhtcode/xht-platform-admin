<script setup lang="ts">
import { querySysDictPage } from '@/service/api/system/dict.api'
import type { SysDictResponse } from '@/service/model/system/dict.model'
import { sysDictStatusEnums } from '@/service/enums/system/dict.enum'

defineOptions({
  name: 'ColumnDictSelect',
  inheritAttrs: false,
})
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)
/**
 * 字典编码
 */
const modelValue = defineModel<string>('modelValue', {
  required: false,
})

/**
 * 表单组件
 */
const fromComponent = defineModel<string>('fromComponent', {
  required: false,
})
const dictData = ref<SysDictResponse[]>([])
const loading = ref<boolean>(false)

/**
 * 字典编码改变
 */
const handleChange = (value: string | any) => {
  if (value) {
    fromComponent.value = 'dict-radio'
  } else {
    fromComponent.value = 'input'
  }
}
const remoteMethod = (queryString: string | undefined) => {
  if (queryString) {
    loading.value = true
    querySysDictPage({
      pageNum: 1,
      pageSize: 10,
      keyWord: queryString,
      descName: 'sortOrder',
      status: sysDictStatusEnums.ENABLED.value,
    })
      .then((res) => {
        dictData.value = res.data?.records || []
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    dictData.value = []
  }
}
onMounted(() => {
  remoteMethod(modelValue.value)
})
</script>

<template>
  <el-select
    v-model="modelValue"
    filterable
    remote
    value-key="id"
    reserve-keyword
    placeholder="请输入关键字，选择字典项目"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="disabled"
    clearable
    :debounce="500"
    remote-show-suffix
    default-first-option
    @change="handleChange"
  >
    <el-option
      v-for="item in dictData"
      :key="item.id"
      :value="item.dictCode"
      :label="item.dictName"
      :disabled="item.status === sysDictStatusEnums.DISABLED.value"
    >
      <div class="flex items-center justify-between">
        <div>{{ item.dictCode }}</div>
        <div>{{ item.dictName }}</div>
      </div>
    </el-option>
    <template #loading>正在搜索请稍等......</template>
    <template #empty>暂无匹配的字典，请更换关键字</template>
  </el-select>
</template>

<style scoped lang="scss"></style>
