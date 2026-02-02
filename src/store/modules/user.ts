import { defineStore } from 'pinia'
import { TOKEN_NAME } from '@/config/global'
import { store, usePermissionStore } from '@/store'
import { login, getUserInfo } from '@/api/user'
import type { LoginParams } from '@/api/model/userModel'

const InitUserInfo = {
  id: 0,
  role: '',
  username: '',
  phone: '',
  avatar: '',
  status: 2,
  inviteCode: '',
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME),
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    role: (state) => state.userInfo?.role,
    status: (state) => state.userInfo?.status,
    inviteCode: (state) => state.userInfo?.inviteCode,
  },
  actions: {
    async login(userInfo: LoginParams) {
      const res = await login(userInfo)
      this.token = res.access_token
      localStorage.setItem(TOKEN_NAME, this.token)
      return res
    },
    /**
     * 获取用户信息
     * 在这里发送请求获取用户信息
     */
    async getUserInfo() {
      const res = await getUserInfo()

      this.userInfo = res
      return res
    },
    async logout() {
      localStorage.removeItem(TOKEN_NAME)
      this.token = ''
      this.userInfo = { ...InitUserInfo }
    },
    async removeToken() {
      this.token = ''
    },
  },
  persist: {
    afterHydrate: async (ctx) => {
      if (ctx.store.role) {
        await ctx.store.getUserInfo()
        const permissionStore = usePermissionStore()
        permissionStore.initRoutes(ctx.store.role)
      }
    },
  },
})

export function getUserStore() {
  return useUserStore(store)
}
