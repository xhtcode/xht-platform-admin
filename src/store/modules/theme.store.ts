import { defineStore } from 'pinia'
import { AppLanguageEnum, ComponentSizeEnum, DeviceEnum } from '@/service/enums'
import pInIaPersistConfig from '@/store/pinia-persist'
import defaultSetting from '@/service/constant/default-setting'

/**
 * 主题相关pinia
 */
export const useThemeStore = defineStore(
  'theme',
  (): ThemeStoreType => {
    /**
     * 布局类型
     */
    const layoutType = ref<'default' | 'columns'>(defaultSetting.layoutType)
    /**
     * 设备类型
     */
    const device = ref<DeviceEnum>(defaultSetting.device)
    /**
     * 侧边栏状态
     */
    const sidebarStatus = ref<boolean>(defaultSetting.sidebarStatus)

    /**
     * 暗黑模式
     */
    const darkStatus = ref<boolean>(defaultSetting.darkStatus)

    /**
     * 菜单状态
     */
    const menuStatus = ref<boolean>(defaultSetting.menuStatus)

    /**
     * 面包屑显示状态
     */
    const breadcrumb = ref<boolean>(defaultSetting.breadcrumb)

    /**
     * tags显示状态
     */
    const tagsViewStatus = ref<boolean>(defaultSetting.tagsViewStatus)

    /**
     * footer 显示
     */
    const footerStatus = ref<boolean>(defaultSetting.footerStatus)

    /**
     * 水印内容
     */
    const watermarkContent = ref<string>(defaultSetting.watermarkContent)

    /**
     * 语言类型
     */
    const languageType = ref<AppLanguageEnum>(defaultSetting.languageType)

    /**
     * UI组件大小类型
     */
    const sizeType = ref<ComponentSizeEnum>(defaultSetting.sizeType)

    /**
     * 默认主题颜色
     */
    const colorType = ref<string>(defaultSetting.colorType)
    /**
     * 哀悼模式
     */
    const mournModeStatus = ref<boolean>(defaultSetting.mournModeStatus)
    /**
     * 色弱模式
     */
    const colorWeaknessModeStatus = ref<boolean>(defaultSetting.colorWeaknessModeStatus)

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
