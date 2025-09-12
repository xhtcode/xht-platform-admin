<template>
  <div>
    <el-form-item label="表名" prop="tableInfo.tableName">
      <el-input v-model="tableInfo.tableName" placeholder="请输入数据库表名" disabled />
    </el-form-item>
    <el-form-item label="表注释" prop="tableInfo.tableComment">
      <el-input v-model="tableInfo.tableComment" placeholder="请输入表注释" disabled />
    </el-form-item>
    <el-form-item label="模板分组" prop="tableInfo.groupId">
      <el-input v-model="tableInfo.groupId" placeholder="请输入分组id" />
    </el-form-item>
    <el-form-item label="模块名称" prop="tableInfo.moduleName">
      <el-input
        v-model="tableInfo.moduleName"
        :maxlength="10"
        show-word-limit
        placeholder="请输入模块名称"
      />
    </el-form-item>
    <el-form-item label="代码名称" prop="tableInfo.codeName">
      <el-input
        v-model="tableInfo.codeName"
        :maxlength="15"
        show-word-limit
        placeholder="请输入代码名称"
      />
    </el-form-item>
    <el-form-item label="代码注释" prop="tableInfo.codeComment">
      <el-input v-model="tableInfo.codeComment" placeholder="请输入代码注释" />
    </el-form-item>
    <el-form-item label="后端作者" prop="tableInfo.backEndAuthor">
      <el-input v-model="tableInfo.backEndAuthor" placeholder="请输入后端作者" />
    </el-form-item>
    <el-form-item label="前端作者" prop="tableInfo.frontEndAuthor">
      <el-input v-model="tableInfo.frontEndAuthor" placeholder="请输入前端作者" />
    </el-form-item>
    <el-form-item label="权限前缀" prop="tableInfo.permissionPrefix">
      <el-input v-model="tableInfo.permissionPrefix" placeholder="请输入权限前缀" disabled />
    </el-form-item>
    <el-form-item label="上级菜单" prop="tableInfo.parentMenuId">
      <el-input v-model="tableInfo.parentMenuId" placeholder="请输入上级菜单" disabled />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import type { GenTableInfoResponse } from '@/model/generate/table.model'

const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
</script>

<style scoped lang="scss"></style>
