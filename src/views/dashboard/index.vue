<script lang="ts" setup>
defineOptions({ name: 'HomeViewComponentIndex' })
</script>

<template>
  <div class="xht-view-container-none">
    <div class="xht-view-main">
      <el-button type="primary" v-permission="['admin']" v-loading="">按钮v-permission</el-button>
      <!--      <p type="primary" v-permission.role="['admin']" v-loading="">按钮v-permission.role</p>
      <p type="primary" v-permission="['sys:dict:update']" v-permission.role="['admin']" v-loading="">按钮</p>-->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
