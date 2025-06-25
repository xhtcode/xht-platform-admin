import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { changeCssProperty } from '@/utils/theme'
import { DeviceEnums } from '@/common/enums'
import type { CSSProperties } from 'vue'
import variables from '@/styles/variables.module.scss'

export const useThemeHooks = () => {
  const themeStore = useThemeStore()
  const { device, sidebarStatus, menuStatus } = storeToRefs(themeStore)
  const menuCollapse = computed<boolean>(() => menuStatus.value)
  /**
   *  DeviceEnums.DESKTOP 侧边栏状态 true 显示，false 隐藏
   */
  const desktopShowStatus = computed(
    () => !sidebarStatus.value && device.value === DeviceEnums.DESKTOP,
  )
  /**
   *  DeviceEnums.MOBILE 侧边栏状态 true 显示，false 隐藏
   */
  const mobileShowStatus = computed(
    () => sidebarStatus.value && device.value === DeviceEnums.MOBILE,
  )

  /**
   * aside 样式
   */
  const asideStyle = computed<CSSProperties>(() => {
    return {
      width: menuCollapse.value ? variables.menuWidth200 : variables.menuWidth64,
    }
  })
  /**
   * main 样式
   */
  const mainStyle = computed(() => {
    return {
      height: `calc(100% - ${variables.headerHeight} - ${themeStore.tagsViewStatus ? variables.tagsHeight : '0px'})`,
    }
  })

  return {
    desktopShowStatus,
    mobileShowStatus,
    menuCollapse,
    asideStyle,
    mainStyle,
  }
}
/**
 *  主题颜色
 */
const useThemeColorHooks = () => {
  const themeStore = useThemeStore()

  const { colorType, mournModeStatus, colorWeaknessModeStatus } = storeToRefs(themeStore)
  /**
   * 改变主题颜色
   */
  const changeThemeColor = (value: string | null) => {
    if (!value) return
    changeCssProperty(`--el-color-primary`, value)
    const rgbArray = rgbToStr(value)
    for (let i = 1; i < 10; i++) {
      changeCssProperty(`--el-color-primary-light-${i}`, `rgb(${rgbArray + ',0.' + (10 - i)})`)
    }
  }
  watch(
    [() => mournModeStatus.value, () => colorWeaknessModeStatus.value],
    (val) => {
      document.documentElement.style.removeProperty('filter')
      if (val[0] && val[1]) {
        document.documentElement.style.setProperty('filter', 'grayscale(100%) invert(80%)')
      } else if (val[0]) {
        document.documentElement.style.setProperty('filter', 'grayscale(100%)')
      } else if (val[1]) {
        document.documentElement.style.setProperty('filter', 'invert(80%)')
      }
    },
    {
      immediate: true,
    },
  )
  onMounted(() => {
    changeThemeColor(colorType.value)
  })
  return {
    changeThemeColor,
  }
}
/**
 * 主题设备
 */
export const useThemeDeviceHooks = () => {
  const themeStore = useThemeStore()
  const { device, sidebarStatus, menuStatus, sizeType } = storeToRefs(themeStore)
  const { width } = useWindowSize()
  const WIDTH_DESKTOP = 768 // 响应式布局容器固定宽度（大屏 >=1200px，中屏 >=992px，小屏 >=768px）
  // 监听窗口宽度变化，调整设备类型和侧边栏状态

  watch(
    width,
    (val) => {
      const isDesktop = val >= WIDTH_DESKTOP
      device.value = isDesktop ? DeviceEnums.DESKTOP : DeviceEnums.MOBILE
      menuStatus.value = !isDesktop
    },
    {
      immediate: true,
    },
  )
  return {
    WIDTH_DESKTOP,
  }
}

export default useThemeColorHooks
/**
 * rgb 颜色转换成字符串
 */
const rgbToStr = (rgb: string) => {
  return rgb.match(/\d+/g)?.toString()
}
