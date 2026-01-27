<script lang="ts" setup>
import type { GenTableInfoResponse } from '@/service/model/generate/table.model'

const tableInfo = defineModel<GenTableInfoResponse>('tableInfo', {
  required: true,
  default: () => {},
})
const restaurants = ref<any[]>([{ value: 'system' }, { value: 'generate' }])
/**
 * 搜索
 */
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
</script>

<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-form-item label="表名" prop="tableInfo.tableName">
          <el-input v-model="tableInfo.tableName" :maxlength="64" disabled placeholder="请输入数据库表名" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="表创建时间" prop="tableInfo.tableCreateTime">
          <el-input v-model="tableInfo.tableCreateTime" :maxlength="20" disabled placeholder="请输入表创建时间" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="表更新时间" prop="tableInfo.tableUpdateTime">
          <el-input v-model="tableInfo.tableUpdateTime" :maxlength="20" disabled placeholder="请输入表更新时间" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="数据库类型" prop="tableInfo.dataBaseType">
          <el-input v-model="tableInfo.dataBaseType" disabled placeholder="请输入数据库类型" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="代码名称" prop="tableInfo.codeName">
          <el-input v-model="tableInfo.codeName" :maxlength="25" placeholder="请输入代码名称" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="引擎名称" prop="tableInfo.engineName">
          <el-input v-model="tableInfo.engineName" disabled placeholder="请输入引擎名称" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="模板分组" prop="tableInfo.groupId">
          <template-group-select v-model="tableInfo.groupId" placeholder="请选择模板分组" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="后端作者" prop="tableInfo.backEndAuthor">
          <el-input v-model="tableInfo.backEndAuthor" :maxlength="50" placeholder="请输入后端作者" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="前端作者" prop="tableInfo.frontEndAuthor">
          <el-input v-model="tableInfo.frontEndAuthor" :maxlength="50" placeholder="请输入前端作者" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="模块名称" prop="tableInfo.moduleName">
          <el-autocomplete v-model="tableInfo.moduleName" placeholder="请输入模块名称" :fetch-suggestions="querySearch" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="业务名称" prop="tableInfo.serviceName">
          <el-input v-model="tableInfo.serviceName" :maxlength="10" placeholder="请输入业务名称" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="请求前缀" prop="tableInfo.urlPrefix">
          <el-input v-model="tableInfo.urlPrefix" :maxlength="50" placeholder="请输入请求前缀" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="权限前缀" prop="tableInfo.permissionPrefix">
          <el-input v-model="tableInfo.permissionPrefix" :maxlength="30" placeholder="请输入权限前缀" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="上级目录" prop="tableInfo.parentMenuId">
          <menu-tree-select v-model="tableInfo.parentMenuId" show-top-menu type="C" placeholder="请选择上级目录" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="菜单图标" prop="tableInfo.menuIcon">
          <icon-select v-model="tableInfo.menuIcon" placeholder="请输入菜单图标" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="菜单地址" prop="tableInfo.menuPath">
          <el-input v-model="tableInfo.menuPath" :maxlength="100" show-word-limit placeholder="请输入菜单地址" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="表注释" prop="tableInfo.tableComment">
          <el-input
            v-model="tableInfo.tableComment"
            :maxlength="200"
            :rows="5"
            disabled
            placeholder="请输入表注释"
            resize="none"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="代码注释" prop="tableInfo.codeComment">
          <el-input
            v-model="tableInfo.codeComment"
            :maxlength="200"
            :rows="5"
            placeholder="请输入代码注释"
            resize="none"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
