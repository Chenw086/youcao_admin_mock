export const orderOptions = [
  {
    label: '产品名称',
    value: 'productName',
  },
  {
    label: '加盟商名称',
    value: 'franchiseeName',
  },
  {
    label: '酒店名称',
    value: 'hotelName',
  },
  {
    label: '房间号',
    value: 'roomNumber',
  },
  {
    label: '用户 id',
    value: 'userId',
  },
  {
    label: '支付状态',
    value: 'payStatusDesc',
  },
  {
    label: '价格',
    value: 'price',
  },
  {
    label: '押金',
    value: 'depositAmount',
  },
  {
    label: '订单创建时间',
    value: 'createTime',
  },
]

export const orderStatusOptions = [
  { label: '待支付', theme: 'primary' },
  { label: '支付成功', theme: 'success' },
  { label: '使用中', theme: 'warning' },
  { label: '已完成', theme: 'success' },
  { label: '已完成-押金退款中', theme: 'success' },
  { label: '已完成-押金已退款', theme: 'success' },
  { label: '已过期', theme: 'primary' },
  { label: '已关闭', theme: 'primary' },
  { label: '已退款', theme: 'danger' },
]
