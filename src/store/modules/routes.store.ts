import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { getRouters } from '@/service/api/permission'
import DynamicRouter from '@/router/modules/dynamic'
import { cloneDeep } from 'lodash'
import { MenuTypeEnums } from '@/service/model/system/menu.model'
import pInIaPersistConfig from '@/store/pinia-persist'

const LayOutIndex = import('@/layout/index.vue')
const viewsModules: any = import.meta.glob('../../views/**/*.{vue,tsx}')
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...viewsModules })
/**
 * 路由列表
 * @methods setRoutesList 设置路由数据
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useRouteStore = defineStore(
  'router',
  () => {
    const isGenerate = ref(false) // 是否生成路由
    const routesRaw = ref<any[]>([]) // 原始路由
    const formatRoutes = ref<RouteRecordRaw[]>([]) //添加路由时使用
    const allRoutes = computed(() => DynamicRouter.concat(routesRaw.value))

    /**
     * 实际路由
     */
    const genFormatRoutes = () => {
      const returnRoutes: RouteRecordRaw[] = []
      if (routesRaw.value) {
        routesRaw.value.forEach((item) => {
          returnRoutes.push({ ...cloneDeep(item) })
        })
        returnRoutes.forEach((item) => {
          if (item.children) {
            const result: RouteRecordRaw[] = []
            formatFlatteningRoutes(result, item.children)
            item.children = result
          }
          return item
        })
      }
      return DynamicRouter.concat(returnRoutes)
    }

    /**
     * 路由多级嵌套数组处理成一维数组
     * @param result 存储处理后路由的数组
     * @param routes 传入路由菜单数据数组
     * @returns 返回处理后的一维路由菜单数组
     */
    const formatFlatteningRoutes = (result: RouteRecordRaw[], routes: RouteRecordRaw[]) => {
      routes.forEach((route) => {
        if (route.children && route.children?.length >= 0) {
          formatFlatteningRoutes(result, route.children)
          delete route.children
          if (route.meta?.menuType === MenuTypeEnums.C) {
            result.push(route)
          }
        } else {
          result.push(route)
          delete route.children
        }
      })
    }

    /**
     *  生成路由（后端获取）
     */
    const generateRoutesAtBack = async () => {
      // 获取路由菜单数据-
      await getRouters()
        .then((res) => {
          // 设置 routes 数据
          routesRaw.value = formatBackRoutes(res.data)
          formatRoutes.value = genFormatRoutes()
          // 创建路由匹配器
          isGenerate.value = true
        })
        .catch((err) => {
          console.error(err)
        })
    }

    /**
     * 格式化后端路由数据
     *
     * @param routes 接口返回所有的动态路由
     * @returns 返回用户有权限的动态路由
     */
    const formatBackRoutes = (routes: any[]) => {
      if (!routes || !routes.length) return []
      return routes.map((route: any) => {
        if (route.meta.menuType === 'M') {
          route.component = () => LayOutIndex
        } else if (!route.meta.linkStatus) {
          if (route.component) {
            route.component = dynamicViewsModules[`../..${route.component}`]
          } else {
            delete route.component
          }
        }
        if (route.children) {
          route.children = formatBackRoutes(route.children)
        }
        return route
      })
    }

    return {
      isGenerate,
      routesRaw,
      allRoutes,
      formatRoutes,
      generateRoutesAtBack,
    }
  },
  {
    persist: pInIaPersistConfig('router', ['activeRoute']),
  }
)
