export const INCOME_LIST = [
  {
    title: '总收入',
    number: 0,
    style: {
      backgroundColor: 'bg-[#E3F9E9]',
    },
    type: 'card',
    admin: 'totalRevenue',
    franchisee: 'commissionAmount',
    hotel: 'commissionAmount',
  },
  {
    title: '总退款',
    number: 0,
    style: {
      backgroundColor: 'bg-[#FFF0ED]',
    },
    type: 'card',
    role: ['admin'],
    admin: 'totalRefund',
  },
  {
    title: '总扣押金额',
    number: 0,
    style: {
      backgroundColor: 'bg-[#E3E9F9]',
    },
    type: 'card',
    role: ['admin'],
  },
  {
    title: '可提现金额',
    number: 0,
    style: {
      backgroundColor: 'bg-[#BAFFF6]',
      cursor: 'pointer',
    },
    type: 'jump',
    name: 'withdraw',
  },
  {
    title: '用户总数',
    number: 0,
    style: {
      backgroundColor: 'bg-[#fff]',
      cursor: 'pointer',
    },
    type: 'jump',
    name: 'user',
    role: ['admin'],
    admin: 'activeUsers',
  },
  {
    title: '订单总数',
    number: 0,
    style: {
      backgroundColor: 'bg-[#fff]',
      cursor: 'pointer',
    },
    type: 'jump',
    name: 'order',
    admin: 'totalOrders',
    franchisee: 'totalOrders',
    hotel: 'totalOrders',
  },
]
