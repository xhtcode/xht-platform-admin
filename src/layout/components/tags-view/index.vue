<template>
  <div class="xht-tags-container">
    <el-tabs v-model="activeName" class="xht-tags-item" type="card" closable>
      <el-tab-pane label="User" name="first" style="display: none" closable>
        <template #label>
          <i class="icon-menu-tree xht-tabs-icon" />
          用户列表
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="xht-tags-tool">
      <el-icon :size="22">
        <ArrowDownBold />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowDownBold } from '@element-plus/icons-vue'

defineOptions({ name: 'TagsViewComponent' })
const activeName = ref('first')
</script>
<style lang="scss">
.xht-tags-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-light);

  .xht-tags-item {
    position: relative;
    width: 100%;
  }

  .el-tabs__header {
    padding: 0 10px;
    height: $tags-height;
    box-sizing: border-box;
    margin: 0;
    border: none;
  }

  .el-tabs__nav {
    border-radius: 4px 4px 0 0;
    display: flex;
    border: none !important;
  }

  .el-tabs__item {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #afafaf;
    border: none !important;
    user-select: none;

    .el-icon {
      width: 14px !important;
    }

    &:hover {
      color: var(--el-color-primary);

      &::before {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0;
        content: '';
        border-bottom: 2px solid var(--el-color-primary) !important;
      }
    }
  }

  .is-active {
    color: var(--el-color-primary);

    &::before {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 0;
      content: '';
      border-bottom: 2px solid var(--el-color-primary) !important;
    }
  }

  .xht-tabs-icon {
    width: 14px;
    height: 14px;
    font-size: 12px;
    position: relative;
    left: -7px;
  }

  .is-closable {
    padding-left: 20px !important;
    padding-right: 20px;
  }

  .xht-tags-tool {
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    width: 60px;
    height: $tags-height;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid var(--el-border-color-light);

    &:hover {
      background-color: var(--xht-hover-bg-color);
    }
  }
}
</style>
