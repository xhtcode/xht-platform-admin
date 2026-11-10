/**
 * 文件用途启用状态
 */
export const fileUsedEnabledEnum: DictEnum<number, 'ENABLED' | 'DISABLED'> = {
  ENABLED: {
    label: '启用',
    value: 1,
    type: 'success',
  },
  DISABLED: {
    label: '停用',
    value: 0,
    type: 'info',
  },
}

/**
 * 文件用途内置标记
 *
 * 1 内置（不允许删除）/ 0 自定义
 */
export const fileUsedBuiltInEnum: DictEnum<number, 'BUILT_IN' | 'CUSTOM'> = {
  BUILT_IN: {
    label: '内置',
    value: 1,
    type: 'warning',
  },
  CUSTOM: {
    label: '自定义',
    value: 0,
    type: 'info',
  },
}

/**
 * 文件用途闸门（下载 / 打印 / 分享）
 *
 * 1 允许 / 0 禁止，三项共用同一套文案。
 */
export const fileGateEnum: DictEnum<number, 'ALLOW' | 'DENY'> = {
  ALLOW: {
    label: '允许',
    value: 1,
    type: 'success',
  },
  DENY: {
    label: '禁止',
    value: 0,
    type: 'danger',
  },
}
