import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { GenTableInfoOperationRequest, GenTableInfoResponse } from '@/service/model/generate/table.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTableInfoOperationForm: Partial<any> = {
  tableInfo: {} as GenTableInfoResponse,
  columnInfos: [],
  queryColumns: [],
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTableInfoOperationRules: FormRules<GenTableInfoOperationRequest> = {
  'tableInfo.groupId': [{ required: true, message: '请输入分组id', trigger: 'change' }],
  'tableInfo.dataBaseType': [{ required: true, message: '请输入数据库类型', trigger: 'change' }],
  'tableInfo.tableName': [{ required: true, message: '请输入数据库表名', trigger: 'change' }],
  'tableInfo.tableComment': [{ required: true, message: '请输入表注释', trigger: 'change' }],
  'tableInfo.moduleName': [{ required: true, message: '请输入模块名称', trigger: 'change' }],
  'tableInfo.serviceName': [{ required: true, message: '请输入业务名称', trigger: 'change' }],
  'tableInfo.codeName': [{ required: true, message: '请输入代码名称', trigger: 'change' }],
  'tableInfo.codeComment': [{ required: true, message: '请输入代码注释', trigger: 'change' }],
  'tableInfo.backEndAuthor': [{ required: true, message: '请输入后端作者', trigger: 'change' }],
  'tableInfo.frontEndAuthor': [{ required: true, message: '请输入前端作者', trigger: 'change' }],
  'tableInfo.urlPrefix': [{ required: true, message: '请输入请求前缀', trigger: 'change' }],
  'tableInfo.permissionPrefix': [{ required: true, message: '请输入权限前缀', trigger: 'change' }],
  'tableInfo.parentMenuId': [{ required: true, message: '请输入上级菜单', trigger: 'change' }],
  'tableInfo.pageStyle': [{ required: true, message: '请输入页面风格', trigger: 'change' }],
  'tableInfo.pageStyleWidth': [{ required: true, message: '请输入页面宽度', trigger: 'change' }],
  'tableInfo.fromNumber': [{ required: true, message: '请输入每行数量', trigger: 'change' }],
}

/**
 * 列表显示配置
 */
export const GenTableInfoColumnOption: ColumnConfig<GenTableInfoResponse> = {
  engineName: { desc: '引擎名称', visible: true, disabled: true },
  tableName: { desc: '数据库表名', visible: true, disabled: true },
  tableComment: { desc: '表注释', visible: true, disabled: true },
  codeName: { desc: '代码名称', visible: true, disabled: true },
  codeComment: { desc: '代码注释', visible: false, disabled: false },
  tableCreateTime: { desc: '表创建时间', visible: false, disabled: false },
  tableUpdateTime: { desc: '表更新时间', visible: false, disabled: false },
}
