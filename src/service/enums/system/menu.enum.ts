import type { MenuCommon, MenuStatus, MenuType } from '@/service/model/system/menu.model'

/**
 * 定义菜单状态枚举类型
 */
export const menuStatusEnums: DictEnum<MenuStatus, 'NORMAL' | 'DISABLE'> = {
  NORMAL: {
    label: '正常',
    value: 0,
  },
  DISABLE: {
    label: '禁用',
    value: 1,
  },
}

/**
 * 菜单类型枚举
 */
export const menuTypeEnums: DictEnum<MenuType> = {
  M: {
    label: '目录',
    value: 'M',
  },
  C: {
    label: '菜单',
    value: 'C',
  },
  B: {
    label: '按钮',
    value: 'B',
  },
}

/**
 * 菜单公共属性
 */
export const menuCommonStatus: DictEnum<MenuCommon, 'NO' | 'YES'> = {
  NO: {
    label: '否',
    value: 0,
  },
  YES: {
    label: '是',
    value: 1,
  },
}
