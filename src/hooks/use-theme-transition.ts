import { nextTick } from 'vue'
import { isDark } from '@/utils/dark'

/**
 * 主题切换过渡动画（圆形擦除，动画效果与 Element Plus 官网一致）
 *
 * 实现思路：借助 View Transitions API 分别对切换前后的根节点做快照，
 * 再以触发按钮的中心为圆心，通过 clip-path: circle() 完成新旧主题的转场：
 * - 明亮 -> 暗黑：旧快照（明亮）由外向内收缩，逐步露出暗黑主题
 * - 暗黑 -> 明亮：新快照（明亮）由内向外扩散，逐步覆盖暗黑主题
 *
 * 动画的几何参数通过 CSS 变量写入 html，由 @/styles/theme/theme-transition.scss 消费，
 * 从而使动画定义与切换逻辑解耦，便于统一调整时长与缓动。
 */

/** 过渡序号，用于连续点击时只清理最后一次过渡的 DOM 状态 */
let latestTransitionId = 0

/**
 * 浏览器是否支持 View Transitions，且用户未开启"减少动态效果"
 */
const canUseViewTransition = () =>
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 清理过渡期间写入的 CSS 变量与标记属性
 */
const clearTransitionState = (root: HTMLElement) => {
  delete root.dataset.themeTransition
  root.style.removeProperty('--theme-transition-x')
  root.style.removeProperty('--theme-transition-y')
  root.style.removeProperty('--theme-transition-radius')
}

export const useThemeTransition = () => {
  /**
   * 执行带圆形转场动画的主题切换
   * @param event 触发切换的事件，用于计算动画圆心
   * @param change 主题切换逻辑（需同步更新主题状态，便于被新快照捕获）
   */
  const withThemeTransition = (event: MouseEvent | undefined, change: () => void) => {
    // 不支持 View Transitions 或用户偏好减少动效时，直接切换
    if (!canUseViewTransition()) {
      change()
      return
    }

    const root = document.documentElement
    const trigger = (event?.currentTarget as HTMLElement | null) ?? null
    const rect = trigger?.getBoundingClientRect()
    // 以触发按钮中心作为动画圆心；无可用坐标时退化为视口右上角（头部工具栏所在位置）
    const hasRect = !!rect && (rect.width > 0 || rect.height > 0)
    const x = rect && hasRect ? rect.left + rect.width / 2 : window.innerWidth - 40
    const y = rect && hasRect ? rect.top + rect.height / 2 : 40
    // 覆盖整个视口所需的半径
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    // 以可覆盖视口对角线的半径作为 100%，便于用百分比表达 clip-path
    const referRadius = Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2

    root.style.setProperty('--theme-transition-x', `${(100 * x) / window.innerWidth}%`)
    root.style.setProperty('--theme-transition-y', `${(100 * y) / window.innerHeight}%`)
    root.style.setProperty('--theme-transition-radius', `${(100 * endRadius) / referRadius}%`)
    // 依据切换前的状态确定动画方向（此刻 isDark 尚未发生变化）
    root.dataset.themeTransition = isDark.value ? 'to-light' : 'to-dark'

    const transitionId = ++latestTransitionId
    const transition = document.startViewTransition(async () => {
      change()
      // 等待 DOM 与样式更新完成，确保新主题被完整快照
      await nextTick()
    })

    transition.finished
      .catch(() => {
        // 过渡可能被浏览器中断（如页面隐藏），此处忽略异常，仅保证状态可清理
      })
      .finally(() => {
        if (transitionId !== latestTransitionId) return
        clearTransitionState(root)
      })
  }

  return { withThemeTransition }
}
