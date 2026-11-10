/**
 * 配置值类型
 *
 * 决定前端渲染的控件：bool → Switch，int → InputNumber，string → Input。
 */
export type FileSettingValueType = 'bool' | 'int' | 'string'

/**
 * 配置覆盖方向
 *
 * 当前版本仅只读展示：后端已落库该字段，但没有对应的写入入口。
 */
export type FileSettingOverrideDirection = 'LOCKED' | 'TIGHTEN_ONLY' | 'FREE'

/**
 * 系统管理-文件全局配置项（SysFileSettingResponse）
 */
export interface SysFileSettingResponse {
  settingKey: string // 配置键
  settingValue: string // 当前值（统一按字符串下发，按 valueType 解析）
  valueType: FileSettingValueType // 值类型
  settingGroup: string // 分组：download/print/share/watermark/convert/session/image/file
  settingName: string // 配置名称
  description?: string | null // 说明
  defaultValue: string // 默认值
  minValue?: string | null // 最小值（int 生效）
  maxValue?: string | null // 最大值（int 生效）
  userOverridable?: number | null // 是否允许用户覆盖（当前仅只读展示）
  overrideDirection?: FileSettingOverrideDirection | null // 覆盖方向（当前仅只读展示）
  overrideMin?: string | null // 用户覆盖最小值
  overrideMax?: string | null // 用户覆盖最大值
  overrideOptions?: string | null // 用户覆盖枚举
  overrideHint?: string | null // 覆盖提示
  version: number // 乐观锁版本号，保存时必须原样回传
}

/**
 * 系统管理-文件全局配置保存项
 *
 * `version` 必填：后端按乐观锁校验，版本不一致会拒绝本次保存。
 */
export interface SysFileSettingUpdateItem {
  key: string // 配置键
  value: string // 新值
  version: number // 版本号
}
