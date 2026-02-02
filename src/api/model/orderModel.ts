export type QueryOrderParams = {
  pageNo: number
  pageSize: number
}

export type OrderListItem = {
  id: number
  // 订单号
  outTradeNo: string
  // 交易号
  transactionId: string
  // 用户ID
  userId: number
  // 用户手机号
  phone: string
  // 酒店ID
  hotelId: number
  // 酒店名称
  hotelName: string
  // 加盟商ID
  franchiseeId: number
  // 加盟商名称
  franchiseeName: string
  // 产品ID
  productId: number
  // 产品名称
  productName: string
  // 机器ID
  machineId: number
  // 房间号
  roomNumber: string
  // 机器编码
  machineCode: string
  // 描述
  description: string
  // 金额
  amount: number
  // 押金
  depositAmount: number
  // 价格
  price: number
  // 押金状态
  depositStatus: number
  // 支付状态
  payStatus: number
  // 支付状态描述
  payStatusDesc: string
  // 交易类型
  tradeType: string
  // 支付时间
  payTime: string
  // 过期时间
  expireTime: string
  // 备注
  remark: string
  // 创建时间
  createTime: string
  // 更新时间
  updateTime: string
  // 订单状态描述
  orderStatusDesc: string
  orderStatus: number
}

export type OrderList = {
  list: OrderListItem[]
  total: number
  current: number
  pages: number
}
