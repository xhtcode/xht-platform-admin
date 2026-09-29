import { SysAreaHashChildType } from '@/service/model/system/area.model'

/**
 * 部门状态枚举
 */
export const sysAreaHashChildEnum: DictEnum<SysAreaHashChildType, 'NO_CHILD' | 'HAS_CHILD'> = {
  NO_CHILD: {
    label: '无子区划',
    value: 0,
  },
  HAS_CHILD: {
    label: '有子区划',
    value: 1,
  },
}
