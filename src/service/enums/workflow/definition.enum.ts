import type { DefinitionStatus, DefinitionType } from '@/service/model/workflow/definition.model'

/**
 * 流程定义类型
 */
export const definitionTypeEnum: DictEnum<DefinitionType, 'category' | 'order'> = {
  category: {
    label: '分类',
    type: 'primary',
    value: 'category',
  },
  order: {
    label: '申请单据',
    type: 'success',
    value: 'order',
  },
}

/**
 * 流程定义状态
 */
export const definitionStatusEnum: DictEnum<DefinitionStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    type: 'success',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    type: 'danger',
    value: 1,
  },
}
