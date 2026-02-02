import Layout from '@/view/layout/index.vue'

export default [
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'order',
    meta: { title: '订单相关' },
    children: [
      {
        path: '/order/index',
        name: 'OrderIndex',
        component: () => import('@/view/page/order/index.vue'),
        meta: { title: '订单管理', icon: 'table' },
      },
    ],
  },
]
