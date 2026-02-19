import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { GenTableInfoOperationRequest, GenTableInfoResponse } from '@/service/model/generate/table.model'

/**
 * 增改页面 表单类型 默认值
 */
export const genTableInfoOperationForm: GenTableInfoOperationRequest = {
  tableInfo: {} as GenTableInfoResponse,
  columnInfos: [],
  queryColumns: [],
}

/**
 * 增改页面 表单类型 表单校验
 */
export const genTableInfoOperationRules: FormRules<Required<GenTableInfoOperationRequest>> = {
  'tableInfo.groupId': [{ required: true, message: '请选择分组id', trigger: 'change' }],
  'tableInfo.dataBaseType': [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
  'tableInfo.tableName': [{ required: true, message: '请输入数据库表名', trigger: 'blur' }],
  'tableInfo.moduleName': [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
  'tableInfo.serviceName': [{ required: true, message: '请输入业务名称', trigger: 'blur' }],
  'tableInfo.codeName': [{ required: true, message: '请输入代码名称', trigger: 'blur' }],
  'tableInfo.codeComment': [{ required: true, message: '请输入代码注释', trigger: 'blur' }],
  'tableInfo.backEndAuthor': [{ required: true, message: '请输入后端作者', trigger: 'blur' }],
  'tableInfo.frontEndAuthor': [{ required: true, message: '请输入前端作者', trigger: 'blur' }],
  'tableInfo.urlPrefix': [{ required: true, message: '请输入请求前缀', trigger: 'blur' }],
  'tableInfo.permissionPrefix': [{ required: true, message: '请输入权限前缀', trigger: 'blur' }],
  'tableInfo.parentMenuId': [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  'tableInfo.pageStyle': [{ required: true, message: '请输入页面风格', trigger: 'blur' }],
  'tableInfo.pageStyleWidth': [{ required: true, message: '请输入页面宽度', trigger: 'blur' }],
  'tableInfo.fromNumber': [{ required: true, message: '请输入每行数量', trigger: 'blur' }],
}

/**
 * 列表显示配置
 */
export const genTableInfoColumnOption: ColumnConfig<GenTableInfoResponse> = {
  engineName: { desc: '引擎名称', visible: true, disabled: true },
  tableName: { desc: '数据库表名', visible: true, disabled: true },
  tableComment: { desc: '表注释', visible: true, disabled: true },
  codeName: { desc: '代码名称', visible: true, disabled: true },
  codeComment: { desc: '代码注释', visible: false, disabled: false },
  tableCreateTime: { desc: '表创建时间', visible: false, disabled: false },
  tableUpdateTime: { desc: '表更新时间', visible: false, disabled: false },
}
