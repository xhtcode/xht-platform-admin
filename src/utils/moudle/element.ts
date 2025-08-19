import type { AxiosResponse } from 'axios'
import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'

// 定义排序方向类型
export type SortOrder = 'ascending' | 'descending' | null

// 定义分页查询参数类型
export interface CrudQueryFrom {
  current?: number
  size?: number
  ascName?: string
  descName?: string

  [key: string]: any
}

// 定义排序信息类型
export interface SortInfo {
  prop?: string
  order?: SortOrder
}

/**
 * 处理表格分页和排序参数
 * @param queryParams 分页查询参数对象
 * @param sortInfo 排序信息（包含prop和order）
 */
export const handlePageParams = (queryParams: CrudQueryFrom, sortInfo?: SortInfo): void => {
  if (!sortInfo) return

  const { order, prop } = sortInfo

  // 根据排序方向设置对应的排序字段
  switch (order) {
    case 'ascending':
      queryParams.ascName = prop
      queryParams.descName = ''
      break
    case 'descending':
      queryParams.ascName = ''
      queryParams.descName = prop
      break
    case null:
      queryParams.ascName = ''
      queryParams.descName = ''
      break
  }
}

/**
 * 处理表单验证错误，触发对应字段的验证提示
 * @param response 接口响应对象
 * @param formRef 表单实例引用
 * @param formData 表单数据对象引用
 */
export const handleFormErrors = (
  response: AxiosResponse<any>,
  formRef: Ref<FormInstance | undefined>,
  formData: Ref<Record<string, any>>,
): void => {
  if (!response?.data || !formRef.value) return

  // 遍历错误字段并触发验证
  Object.keys(response.data).forEach((field) => {
    // 触发验证前先清空再恢复值，确保验证状态更新
    const originalValue = formData.value[field]
    formData.value[field] = undefined
    formRef?.value?.validateField(field)
    formData.value[field] = originalValue
  })
}

/**
 * 时间选择器禁用规则：只能选择今天及以前的时间
 * @param time 待验证的时间
 * @returns 是否禁用
 */
export const disabledFutureDates = (time: Date | undefined): boolean => {
  if (!time) return true
  return time.getTime() > Date.now()
}

/**
 * 时间选择器禁用规则：只能选择今天及以后的时间
 * @param time 待验证的时间
 * @returns 是否禁用
 */
export const disabledPastDates = (time: Date | undefined): boolean => {
  if (!time) return true
  // 8.64e7 是一天的毫秒数(24*60*60*1000)
  return time.getTime() < Date.now() - 8.64e7
}

/**
 * 时间选择器禁用规则：只能选择今天以前的时间（不包含今天）
 * @param time 待验证的时间
 * @returns 是否禁用
 */
export const disabledTodayAndFuture = (time: Date | undefined): boolean => {
  if (!time) return true
  return time.getTime() > Date.now() - 8.64e7
}

/**
 * 时间选择器禁用规则：只能选择今天以后的时间（不包含今天）
 * @param time 待验证的时间
 * @returns 是否禁用
 */
export const disabledTodayAndPast = (time: Date | undefined): boolean => {
  if (!time) return true
  return time.getTime() <= Date.now()
}
