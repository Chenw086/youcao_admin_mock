import { useRoute, createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import uniq from 'lodash/uniq'

// 自动导入modules文件夹下所有ts文件
const modules = (import.meta as ImportMeta).glob('./modules/**/*.ts', { eager: true })

const routeModuleList: Array<RouteRecordRaw> = []

// 同步加载所有路由模块
Object.keys(modules).forEach((key) => {
  const module = modules[key] as { default: RouteRecordRaw | RouteRecordRaw[] }
  const mod = module.default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 关于单层路由，meta 中设置 { single: true } 即可为单层路由，{ hidden: true } 即可在侧边栏隐藏该路由

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [...routeModuleList]

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/',
    redirect: '/dashboard/base',
  },
  {
    path: '/:w+',
    name: '404Page',
    redirect: '/result/404',
    meta: {
      title: '404',
    },
  },
]

export const allRoutes = [...defaultRouterList, ...asyncRouterList]

/**
 *
 * @returns 展开的路由
 * @description
 *  - uniq: 去重
 */
export const getRoutesExpanded = () => {
  const expandedRoutes: string[] = []

  allRoutes.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path)
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path)
          expandedRoutes.push(`${child.path}`)
        })
    }
  })
  return uniq(expandedRoutes)
}

export const getActive = (maxLevel = 3): string => {
  const route = useRoute()
  if (!route.path) {
    return ''
  }
  return route.path
    .slice(1)
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
