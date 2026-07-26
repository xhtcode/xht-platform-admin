import { defineStore } from 'pinia'
import { AppLanguageEnum, ComponentSizeEnum, DeviceEnum } from '@/service/enums'
import pInIaPersistConfig from '@/store/pinia-persist'
import { DefaultThemeColor } from '@/service/constant'

/**
 * 主题相关pinia
 */
export const useThemeStore = defineStore(
  'theme',
  (): ThemeStoreType => {
    /**
     * 布局类型
     */
    const layoutType = ref<'default' | 'columns'>('default')
    /**
     * 设备类型
     */
    const device = ref<DeviceEnum>(DeviceEnum.MOBILE)
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
    const tagsViewStatus = ref<boolean>(false)

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
    const languageType = ref<AppLanguageEnum>(AppLanguageEnum.ZH_CN)

    /**
     * UI组件大小类型
     */
    const sizeType = ref<ComponentSizeEnum>(ComponentSizeEnum.DEFAULT)

    /**
     * 默认主题颜色
     */
    const colorType = ref<string>(DefaultThemeColor)
    /**
     * 哀悼模式
     */
    const mournModeStatus = ref<boolean>(false)
    /**
     * 色弱模式
     */
    const colorWeaknessModeStatus = ref<boolean>(false)

    return {
      layoutType,
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
      'layoutType',
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
