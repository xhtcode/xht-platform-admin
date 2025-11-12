import { UserTypeEnums } from '@/service/model/system/user.model'

/**
 * 用户状态标签组件的属性接口
 * 继承自 Element Plus 的 TagProps，添加了 status 属性用于指定用户状态
 */
export interface UserTypeTagProps {
  /**
   * 用户状态枚举值
   */
  type: UserTypeEnums
}
