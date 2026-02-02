import Layout from '@/view/layout/index.vue'

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: { title: '仪表盘' },
    children: [
      {
        path: '/dashboard/base',
        name: 'DashboardBase',
        component: () => import('@/view/page/dashboard/index.vue'),
        meta: { title: '主页', icon: 'home' },
      },
    ],
  },
]
