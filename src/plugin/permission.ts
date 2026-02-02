import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { getPermissionStore, getUserStore } from '@/store'
import router from '@/router'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const userStore = getUserStore()
  const permissionStore = getPermissionStore()
  const { whiteListRouters } = permissionStore

  const { token } = userStore
  if (token) {
    if (to.path === '/login') {
      next()
      return
    }

    const { role, status } = userStore

    if (!role) {
      await userStore.getUserInfo()
    }

    if (!status) {
      // 有权限
      try {
        const { routers } = permissionStore

        if (!routers.length) {
          await permissionStore.initRoutes(role)
        }

        if (to.name && router.hasRoute(to.name)) {
          next()
        } else {
          next(`/`)
        }
      } catch {
        next({
          path: '/login',
          query: { redirect: encodeURIComponent(to.fullPath) },
        })
        NProgress.done()
      }
    } else {
      // 无权限
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
      NProgress.done()
    }
  } else {
    /* white list router */
    if (whiteListRouters.includes(to.path)) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
    }
    NProgress.done()
  }
})

router.afterEach((to) => {
  // 更新页面标题
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} - 诱巢`
  }
  if (to.path.includes('/login')) {
    const userStore = getUserStore()
    const permissionStore = getPermissionStore()

    userStore.logout()
    permissionStore.restore()
  }

  NProgress.done()
})
