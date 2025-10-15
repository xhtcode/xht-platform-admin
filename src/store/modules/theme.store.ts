import { defineStore } from 'pinia'
import { AppLanguageEnums, ComponentSizeEnums, DeviceEnums } from '@/service/enums'
import pInIaPersistConfig from '@/store/pinia-persist'
import { DefaultThemeColor } from '@/service/constant'

/**
 * 主题相关pinia
 */
export const useThemeStore = defineStore(
  'theme',
  (): ThemeStoreType => {
    /**
     * 设备类型
     */
    const device = ref<DeviceEnums>(DeviceEnums.MOBILE)
    /**
     * 侧边栏状态
     */
    const sidebarStatus = ref<boolean>(false)

    /**
     * 暗黑模式
     */
    const darkStatus = ref<boolean>(false)

    /**
     * 菜单状态
     */
    const menuStatus = ref<boolean>(false)

    /**
     * 面包屑显示状态
     */
    const breadcrumb = ref<boolean>(true)

    /**
     * tags显示状态
     */
    const tagsViewStatus = ref<boolean>(true)

    /**
     * footer 显示
     */
    const footerStatus = ref<boolean>(true)

    /**
     * 水印内容
     */
    const watermarkContent = ref<string>('xht-platform-admin')

    /**
     * 语言类型
     */
    const languageType = ref<AppLanguageEnums>(AppLanguageEnums.ZH_CN)

    /**
     * UI组件大小类型
     */
    const sizeType = ref<ComponentSizeEnums>(ComponentSizeEnums.DEFAULT)

    /**
     * 默认主题颜色
     */
    const colorType = ref<string>(DefaultThemeColor)
    const mournModeStatus = ref<boolean>(false)
    const colorWeaknessModeStatus = ref<boolean>(false)

    return {
      device,
      sidebarStatus,
      darkStatus,
      menuStatus,
      breadcrumb,
      tagsViewStatus,
      footerStatus,
      watermarkContent,
      languageType,
      sizeType,
      colorType,
      mournModeStatus,
      colorWeaknessModeStatus,
    }
  },
  {
    persist: pInIaPersistConfig('theme', [
      'darkStatus',
      'menuStatus',
      'breadcrumb',
      'tagsViewStatus',
      'footerStatus',
      'watermarkContent',
      'languageType',
      'sizeType',
      'colorType',
    ]),
  }
)
