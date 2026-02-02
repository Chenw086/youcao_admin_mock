import Layout from '@/view/layout/index.vue'

export default [
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    name: 'device',
    meta: { title: '机器相关' },
    children: [
      {
        path: '/device/index',
        name: 'DeviceIndex',
        component: () => import('@/view/page/device/index.vue'),
        meta: {
          title: '机器管理',
          icon: 'remote-wave',
          roleCode: ['admin', 'franchisee', 'hotel'],
        },
      },
    ],
  },
]
