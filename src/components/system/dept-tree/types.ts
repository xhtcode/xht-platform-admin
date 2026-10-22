import type { SysDeptResponse } from '@/service/model/system/dept.model'

/**
 * 部门树组件 emit 类型
 */
export interface DeptTreeEmits {
  (e: 'clickNode', data: SysDeptResponse): void // 点击节点
}
