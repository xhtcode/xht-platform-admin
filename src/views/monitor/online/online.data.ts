import type { ColumnConfig } from '@/components/table-tool-bar/types'

export const SysUserOnlineColumnOption: ColumnConfig<any> = {
  tokenId: {
    label: '会话编号',
    visible: true,
    width: '220px',
  },
  userName: {
    label: '用户名称',
    visible: true,
    width: '120px',
  },
  deptName: {
    label: '部门',
    visible: true,
    width: '120px',
  },
  ipaddr: {
    label: '主机',
    visible: true,
    width: '120px',
  },
  loginLocation: {
    label: '登录地点',
    visible: true,
    width: '120px',
  },
  browser: {
    label: '浏览器',
    visible: true,
    width: '120px',
  },
  os: {
    label: '操作系统',
    visible: true,
    width: '120px',
  },
  loginTime: {
    label: '登录时间',
    visible: true,
    width: 180,
  },
}
