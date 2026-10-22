import type { SysFileResponse } from '@/service/model/system/file.model'
import type { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 文件 列表显示配置
 */
export const sysFileColumnOption: ColumnConfig<SysFileResponse> = {
  fileOriginalName: { desc: '文件原始名称', visible: true, disabled: true },
  fileDesc: { desc: '文件描述', visible: true, disabled: false },
  fileType: { desc: '文件类型', visible: true, disabled: false },
  fileSuffix: { desc: '文件后缀', visible: true, disabled: false },
  fileSizeInfo: { desc: '文件大小', visible: true, disabled: false },
  fileStatus: { desc: '文件状态', visible: true, disabled: true },
  fileUsed: { desc: '文件用途', visible: true, disabled: false },
  fileStorageType: { desc: '存储类型', visible: true, disabled: false },
  fileStorageName: { desc: '存储名称', visible: false, disabled: false },
  fileStorageKey: { desc: '存储Key', visible: true, disabled: false },
  fileStoragePath: { desc: '存储路径', visible: false, disabled: false },
  fileHash: { desc: '文件hash', visible: false, disabled: false },
  fileUploadTime: { desc: '上传时间', visible: true, disabled: false },
  fileUploadUser: { desc: '上传用户', visible: false, disabled: false },
  createBy: { desc: '创建人', visible: false, disabled: false },
  createTime: { desc: '创建时间', visible: false, disabled: false },
  updateBy: { desc: '更新人', visible: false, disabled: false },
  updateTime: { desc: '更新时间', visible: false, disabled: false },
}
