import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import router, { asyncRouterList } from '@/router'
import { store } from '@/store'

interface RemoveRouteItem {
  parentName: string
  route: RouteRecordRaw
}

function filterPermissionsRouters(routes: Array<RouteRecordRaw>, role: string) {
  const res: RouteRecordRaw[] = []
  const removeRoutes: RemoveRouteItem[] = []
  routes.forEach((route) => {
    const children: RouteRecordRaw[] = []
    route.children?.forEach((childRouter) => {
      const { roleCode, isHidden } = childRouter.meta as {
        roleCode: string[]
        isHidden: boolean
      }
      if ((roleCode?.includes(role) || !roleCode) && !isHidden) {
        children.push(childRouter)
      } else if (!isHidden) {
        removeRoutes.push({ parentName: route.name as string, route: childRouter })
      }
    })
    if (children.length > 0) {
      route.children = children
      res.push(route)
    }
  })
  return { accessedRouters: res, removeRoutes }
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [] as RouteRecordRaw[],
    removeRoutes: [] as RemoveRouteItem[],
  }),
  getters: {
    sideMenu: (state) =>
      state.routers.reduce((pre, cur) => {
        if (cur.children && cur.children.length > 1) {
          pre.push(cur)
        }
        if (cur.children && cur.children.length === 1) {
          const child = cur.children[0]
          if (child) {
            pre.push(child)
          }
        }
        if (!cur.children || cur.children.length === 0) {
          pre.push(cur)
        }

        return pre
      }, [] as RouteRecordRaw[]),
  },
  actions: {
    async initRoutes(role: string) {
      const { accessedRouters: resAccessedRouters, removeRoutes: resRemoveRoutes } =
        filterPermissionsRouters(asyncRouterList, role)

      this.routers = resAccessedRouters
      this.removeRoutes = resRemoveRoutes

      resRemoveRoutes.forEach((item: RemoveRouteItem) => {
        if (item.route.name && router.hasRoute(item.route.name)) {
          router.removeRoute(item.route.name)
        }
      })
    },
    async restore() {
      this.removeRoutes.forEach(({ parentName, route }) => {
        if (route.name && !router.hasRoute(route.name)) {
          router.addRoute(parentName, route)
        }
      })
      this.routers = []
      this.removeRoutes = []
    },
  },
})

export function getPermissionStore() {
  return usePermissionStore(store)
}
