<template>
  <div class="variate-example-container">
    <el-input v-model="filterValue" clearable placeholder="请输入变量名称" />
    <div class="flex-1 h-500px mt-1 overflow-auto">
      <div class="p-10px w-full" v-for="item in variateData" :key="item.value" style="z-index: -1">
        <div class="variate-example-header">
          <div class="variate-example-value flex-center">{{ item.value }}</div>
          <div class="variate-example-type flex-center">{{ item.type }}</div>
          <div class="variate-example-name flex-center">
            {{ item.name }}
            <el-tooltip :content="item.desc" placement="top">
              <el-icon :size="18">
                <InfoFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
        <pre class="variate-example-block cursor-pointer">{{ item.example }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import data from '@/1'
import { InfoFilled } from '@element-plus/icons-vue'

const filterValue = ref<string>('')
const variateData = computed<any[]>(() => {
  if (!filterValue || filterValue.value === '') {
    return data
  }
  return data.filter((item) => {
    return (
      item.value.includes(filterValue.value) ||
      item.name.includes(filterValue.value) ||
      item.type.includes(filterValue.value) ||
      item.desc.includes(filterValue.value)
    )
  })
})
</script>
<style lang="scss" scoped>
.variate-example-container {
  padding: 20px;

  .variate-example-header {
    user-select: none;
    display: flex;
    justify-items: center;
    padding: 10px;
    line-height: inherit;
    border: 1px solid var(--el-border-color);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    .variate-example-value {
      font-size: 18px;
      font-weight: bold;
    }

    .variate-example-type {
      font-size: 12px;
      font-weight: bold;
      background: var(--el-color-primary);
      color: white;
      border-radius: 5px;
      padding: 4px;
    }

    .variate-example-name {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }

  .variate-example-block {
    border: 1px solid var(--el-border-color);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top: none;
    padding: 4px;
    width: 100%;
    height: 100px;
    overflow: auto;
    font-size: 14px;
    color: #f8f8f2;
    line-height: 1.4;
    background: #2d2d2d;
  }
}
</style>
