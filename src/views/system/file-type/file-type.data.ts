import type { FormRules } from 'element-plus'
import type { ColumnConfig } from '@/components/table-tool-bar/types'
import type { SysFileTypeOperationRequest, SysFileTypeResponse } from '@/service/model/system/file-type.model'

/**
 * 文件预览类型配置 表单初始值
 *
 * 新增时默认落在「图片」，预览类型变更后会自动同步默认名称。
 */
export const sysFileTypeOperationForm: SysFileTypeOperationRequest = {
  previewType: 'image',
  previewName: '图片',
  fileSuffix: null,
  sort: 1,
}

/**
 * 文件预览类型配置 表单校验规则
 */
export const sysFileTypeOperationRules: FormRules = {
  previewType: [{ required: true, message: '请选择预览类型', trigger: 'change' }],
  previewName: [{ required: true, message: '请输入预览类型名称', trigger: 'blur' }],
  fileSuffix: [{ max: 30, message: '文件后缀长度不能超过 30 个字符', trigger: 'blur' }],
}

/**
 * 文件预览类型配置 列表显示配置
 */
export const sysFileTypeColumnOption: ColumnConfig<SysFileTypeResponse> = {
  previewType: { desc: '预览类型', visible: true, disabled: true },
  previewName: { desc: '预览类型名称', visible: true, disabled: false },
  fileSuffix: { desc: '文件后缀', visible: true, disabled: false },
  sort: { desc: '类型排序', visible: true, disabled: false },
}
