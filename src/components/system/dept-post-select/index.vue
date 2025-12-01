<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <dept-tree-select v-model="deptId" placeholder="请选择所属部门信息" @change="handleDept" />
    </el-col>
    <el-col :span="12">
      <el-select v-model="postId" v-loading="state.loadingStatus" clearable placeholder="请选择所属岗位信息">
        <el-option v-for="item in postData" :key="item.id" :value="item.id" :disabled="item.postStatus !== 0" :label="item.postName" />
      </el-select>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import type { ModeIdType } from '@/service/model/base.model'
import { findListByDeptId } from '@/service/api/system/dept.post.api'
import type { SysDeptPostResponse } from '@/service/model/system/dept.post.model'

interface DeptPostSelectTreeProps {
  deptId?: ModeIdType
  postId?: ModeIdType
}

defineOptions({ name: 'DeptPostSelect' })
const state = reactive({
  loadingStatus: false,
})
const props = withDefaults(defineProps<DeptPostSelectTreeProps>(), {
  deptId: undefined,
  postId: undefined,
})
const emits = defineEmits<{
  (e: 'update:deptId'): void
  (e: 'update:postId'): void
}>()
const { deptId, postId } = useVModels(props, emits)
const postData = ref<SysDeptPostResponse[]>([])

const handleDept = async (data: any) => {
  stop.value = false
  state.loadingStatus = true
  postId.value = null
  if (data) {
    await findListByDeptId(data).then((res) => {
      postData.value = res.data
    })
  }
  state.loadingStatus = false
}
const stop = ref(true)
watch(
  () => deptId.value,
  (newVal) => {
    if (newVal && stop.value) {
      findListByDeptId(newVal).then((res) => {
        postData.value = res.data
        stop.value = false
      })
    }
    if (!newVal) {
      postData.value = []
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<style scoped lang="scss"></style>
