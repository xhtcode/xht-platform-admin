import { AppLanguageEnum, ComponentSizeEnum, DeviceEnum } from '@/service/enums'
import { DefaultThemeColor } from '@/service/constant/index'

const defaultSetting: ThemeDefaultSettingType = {
  layoutType: 'default', // 布局类型
  device: DeviceEnum.DESKTOP, // 设备类型
  sidebarStatus: false, // 侧边栏状态
  darkStatus: false, // 暗黑模式
  menuStatus: true, // 菜单状态
  breadcrumb: true, // 面包屑显示状态
  tagsViewStatus: true, // 标签页显示状态
  footerStatus: true, // 底部版权显示
  watermarkContent: 'xht-platform-admin', // 水印内容
  languageType: AppLanguageEnum.ZH_CN, // 语言类型
  sizeType: ComponentSizeEnum.DEFAULT, // UI组件大小类型
  colorType: DefaultThemeColor, // 默认主题颜色
  mournModeStatus: false, // 悼念模式
  colorWeaknessModeStatus: false, // 色弱模式
}

export default defaultSetting
