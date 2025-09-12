import type { FormRules } from 'element-plus'
import type { ColumnOption } from '@/components/table-tool-bar/types'
import type {
  GenTableInfoOperationRequest,
  GenTableInfoResponse,
} from '@/model/generate/table.model'

/**
 * 增改页面 表单类型 默认值
 */
export const GenTableInfoOperationForm: GenTableInfoOperationRequest = {
  tableInfo: {} as GenTableInfoResponse,
  columnInfos: [],
  queryColumns: [],
}

/**
 * 增改页面 表单类型 表单校验
 */
export const GenTableInfoOperationRules: FormRules<GenTableInfoOperationRequest> = {
  'tableInfo.groupId': [
    {
      required: true,
      message: '请选择分组',
      trigger: 'change'
    }
  ],
  'tableInfo.dataSourceId': [
    {
      required: true,
      message: '请选择数据源',
      trigger: 'change'
    }
  ],
  'tableInfo.tableName': [
    {
      required: true,
      message: '请输入表名称',
      trigger: 'blur'
    }
  ],
  'tableInfo.tableComment': [
    {
      required: true,
      message: '请输入表注释',
      trigger: 'blur'
    }
  ],
  'tableInfo.moduleName': [
    {
      required: true,
      message: '请输入模块名称',
      trigger: 'blur'
    }
  ],
  'tableInfo.codeName': [
    {
      required: true,
      message: '请输入代码名称',
      trigger: 'blur'
    }
  ],
  'tableInfo.backEndAuthor': [
    {
      required: true,
      message: '请输入后端作者',
      trigger: 'blur'
    }
  ],
  'tableInfo.frontEndAuthor': [
    {
      required: true,
      message: '请输入前端作者',
      trigger: 'blur'
    }
  ],
  'tableInfo.pageStyle': [
    {
      required: true,
      message: '请选择页面风格',
      trigger: 'change'
    }
  ],
  'tableInfo.fromNumber': [
    {
      required: true,
      message: '请选择每行数量',
      trigger: 'change'
    }
  ]
}

/**
 * 列表显示配置
 */
export const GenTableInfoColumnOption: ColumnOption[] = []
