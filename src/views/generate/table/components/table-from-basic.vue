<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-form-item label="表名" prop="tableInfo.tableName">
          <el-input
            v-model="tableInfo.tableName"
            placeholder="请输入数据库表名"
            disabled
            show-word-limit
            :maxlength="64"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="表创建时间" prop="tableInfo.tableCreateTime">
          <el-input
            v-model="tableInfo.tableCreateTime"
            placeholder="请输入表创建时间"
            disabled
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="表更新时间" prop="tableInfo.tableUpdateTime">
          <el-input
            v-model="tableInfo.tableUpdateTime"
            placeholder="请输入表更新时间"
            disabled
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="数据库类型" prop="tableInfo.dataBaseType">
          <el-input v-model="tableInfo.dataBaseType" disabled placeholder="请输入数据库类型" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="代码名称" prop="tableInfo.codeName">
          <el-input
            v-model="tableInfo.codeName"
            :maxlength="15"
            show-word-limit
            placeholder="请输入代码名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="引擎名称" prop="tableInfo.engineName">
          <el-input v-model="tableInfo.engineName" disabled placeholder="请输入引擎名称" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="模板分组" prop="tableInfo.groupId">
          <el-input v-model="tableInfo.groupId" placeholder="请输入分组id" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="上级菜单" prop="tableInfo.parentMenuId">
          <el-input v-model="tableInfo.parentMenuId" placeholder="请输入上级菜单" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="前端作者" prop="tableInfo.frontEndAuthor">
          <el-input
            v-model="tableInfo.frontEndAuthor"
            placeholder="请输入前端作者"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="后端作者" prop="tableInfo.backEndAuthor">
          <el-input
            v-model="tableInfo.backEndAuthor"
            placeholder="请输入后端作者"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="模块名称" prop="tableInfo.moduleName">
          <el-input
            v-model="tableInfo.moduleName"
            :maxlength="10"
            show-word-limit
            placeholder="请输入模块名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="业务名称" prop="tableInfo.serviceName">
          <el-input
            v-model="tableInfo.serviceName"
            :maxlength="10"
            show-word-limit
            placeholder="请输入业务名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="请求前缀" prop="tableInfo.urlPrefix">
          <el-input
            v-model="tableInfo.urlPrefix"
            placeholder="请输入请求前缀"
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="权限前缀" prop="tableInfo.permissionPrefix">
          <el-input
            v-model="tableInfo.permissionPrefix"
            placeholder="请输入权限前缀"
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="表注释" prop="tableInfo.tableComment">
          <el-input
            v-model="tableInfo.tableComment"
            type="textarea"
            resize="none"
            :rows="5"
            placeholder="请输入表注释"
            disabled
            show-word-limit
            :maxlength="200"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="代码注释" prop="tableInfo.codeComment">
          <el-input
            v-model="tableInfo.codeComment"
            type="textarea"
            resize="none"
            :rows="5"
            placeholder="请输入代码注释"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
</script>

<style scoped lang="scss"></style>
