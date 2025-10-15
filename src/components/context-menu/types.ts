export interface ContextMenuSchemaType {
  icon: string //菜单图标
  label: string //菜单名称
  command: OperationType | string //命令
  disabled?: boolean | any //禁用
  divided?: boolean //下划线
}
export interface PropsTypes {
  trigger?: 'click' | 'hover' | 'focus' | 'contextmenu'
  disabled?: boolean
}
