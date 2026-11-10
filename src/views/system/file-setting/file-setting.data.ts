/**
 * 配置分组展示名称
 *
 * 后端按 `settingGroup` 下发，前端只负责翻译。
 */
export const FILE_SETTING_GROUP_LABEL: Record<string, string> = {
  download: '下载策略',
  print: '打印策略',
  share: '分享策略',
  watermark: '水印',
  convert: '转换与清理',
  session: '会话',
  image: '图片',
  file: '其他',
}

/**
 * 配置分组展示顺序
 *
 * 与业务链路一致：下载 → 打印 → 分享 → 水印 → 转换 → 会话 → 图片 → 其他。
 */
export const FILE_SETTING_GROUP_ORDER: string[] = ['download', 'print', 'share', 'watermark', 'convert', 'session', 'image', 'file']
