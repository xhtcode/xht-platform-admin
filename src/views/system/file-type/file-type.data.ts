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
  fileSuffix: undefined,
}

/**
 * 文件预览类型配置 表单校验规则
 */
export const sysFileTypeOperationRules: FormRules<Required<SysFileTypeOperationRequest>> = {
  previewType: [{ required: true, message: '请选择预览类型', trigger: 'change' }],
  previewName: [
    { required: true, message: '请输入预览类型名称', trigger: 'blur' },
    { whitespace: true, message: '预览类型名称不能全为空格', trigger: 'blur' },
    { max: 30, message: '预览类型名称长度不能超过 30 个字符', trigger: 'blur' },
  ],
  fileSuffix: [
    { max: 30, message: '文件后缀长度不能超过 30 个字符', trigger: 'blur' },
    {
      // 后缀允许留空（表示该预览类型的默认名称配置），非空时必须是单个不带点的后缀
      validator: (_rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        if (!/^[A-Za-z0-9][A-Za-z0-9_+-]*$/.test(value)) {
          callback(new Error('文件后缀为单个后缀且不带点，如 jpg'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

/**
 * 文件预览类型配置 列表显示配置
 */
export const sysFileTypeColumnOption: ColumnConfig<SysFileTypeResponse> = {
  previewType: { desc: '预览类型', visible: true, disabled: true },
  previewName: { desc: '预览类型名称', visible: true, disabled: false },
  fileSuffix: { desc: '文件后缀', visible: true, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: true, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
