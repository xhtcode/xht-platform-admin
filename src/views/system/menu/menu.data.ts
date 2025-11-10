import type { SysMenuOperationRequest, SysMenuResponse } from '@/service/model/system/menu.model'
import {
  MenuCacheEnums,
  MenuHiddenEnums,
  MenuStatusEnums,
  MenuTypeEnums,
} from '@/service/model/system/menu.model'
import type { FormRules } from 'element-plus'
import { ColumnConfig } from '@/components/table-tool-bar/types'

/**
 * 增改页面 表单类型 默认值
 */
export const SysMenuOperationForm: SysMenuOperationRequest = {
  id: null,
  parentId: '0', // 父菜单ID
  menuType: MenuTypeEnums.M, // 类型，默认为目录
  menuName: '', // 菜单名称，默认为空
  menuIcon: '', // 菜单图标，默认为空
  menuPath: '', // 路由地址，默认为空
  menuHidden: MenuHiddenEnums.SHOW, // 显示状态，默认为显示
  menuCache: MenuCacheEnums.NO, // 是否缓存，默认为否
  menuStatus: MenuStatusEnums.NORMAL, // 菜单状态，默认为正常
  menuAuthority: '', // 菜单权限字符串，默认为空
  menuSort: 0, // 菜单排序，默认为0
  viewName: '', // 组件视图名称，默认为空
  viewPath: '', // 组件视图路径，默认为空
  frameFlag: 0, // 是否为外链，默认为否
}

/**
 * 增改页面 表单类型 表单校验
 */
export const SysMenuOperationRules: FormRules = {
  parentId: [{ required: true, message: '父菜单ID不能为空', trigger: 'blur' }],
  menuType: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
  menuName: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '菜单名称长度在1到50个字符之间', trigger: 'blur' },
  ],
  menuIcon: [{ required: true, message: '菜单图标可以为空', trigger: 'blur' }],
  menuPath: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '路由地址长度在1到100个字符之间', trigger: 'blur' },
  ],
  menuHidden: [{ required: true, message: '显示状态不能为空', trigger: 'change' }],
  menuCache: [{ required: true, message: '是否缓存不能为空', trigger: 'change' }],
  menuStatus: [{ required: true, message: '菜单状态不能为空', trigger: 'change' }],
  menuAuthority: [{ required: false, message: '菜单权限字符串可以为空', trigger: 'blur' }],
  menuSort: [
    { required: true, message: '菜单排序不能为空', trigger: 'blur' },
    { type: 'number', message: '菜单排序必须为数字', trigger: 'blur' },
  ],
  viewName: [{ required: true, message: '组件视图名称可以为空', trigger: 'blur' }],
  viewPath: [{ required: true, message: '组件视图路径可以为空', trigger: 'blur' }],
  frameFlag: [
    { required: true, message: '是否为外链不能为空', trigger: 'change' },
    { type: 'number', message: '是否为外链必须为数字', trigger: 'blur' },
  ],
}

/**
 * 列表显示配置
 */
export const SysMenuColumnOption: ColumnConfig<SysMenuResponse> = {
  menuType: { desc: '菜单类型', visible: true, disabled: false },
  menuName: { desc: '菜单名称', visible: true, disabled: false },
  menuIcon: { desc: '菜单图标', visible: true, disabled: false },
  menuHidden: { desc: '显示状态', visible: true, disabled: false },
  menuCache: { desc: '缓存状态', visible: true, disabled: false },
  menuStatus: { desc: '菜单状态', visible: true, disabled: false },
  menuAuthority: { desc: '权限标识', visible: true, disabled: false },
  menuSort: { desc: '菜单排序', visible: true, disabled: false },
  viewPath: { desc: '组件视图', visible: true, disabled: false },
  frameFlag: { desc: '外链', visible: true, disabled: false },
  menuPath: { desc: '路由地址', visible: true, disabled: false },

  createBy: {
    desc: '创建人',
    visible: true,
    disabled: false,
  },
  createTime: {
    desc: '创建时间',
    visible: true,
    disabled: false,
  },
  updateBy: {
    desc: '更新人',
    visible: false,
    disabled: false,
  },
  updateTime: {
    desc: '更新时间',
    visible: false,
    disabled: false,
  },
}
