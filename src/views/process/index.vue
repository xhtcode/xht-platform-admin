<script setup lang="ts">
defineOptions({
  name: 'ProcessIndex',
})
const state = ref<boolean>(false)
</script>

<template>
  <div>
    <el-button @click="state = !state">点击我打开</el-button>
    <el-drawer :body-class="'pt-0!'" append-to-body v-model="state" title="标题" size="100%">
      <bpmn-editor />
    </el-drawer>
  </div>
</template>

<style scoped lang="scss"></style>
