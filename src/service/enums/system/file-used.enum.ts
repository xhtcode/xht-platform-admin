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
