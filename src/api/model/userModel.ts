// 登录参数接口
export type LoginParams<T extends 1 | 2 = 1 | 2> = {
  phone: string
  loginType: T
} & (T extends 1 ? { password: string } : { captcha: string })

export interface LoginResult {
  access_token: string
  expires_in: string
}

export type UserInfo = {
  id: number
  // admin 超管 franchisee 加盟商 hotel 酒店
  role: string
  username: string
  phone: string
  avatar: string
  // 0 通过 1 停用 2 待审批 3 驳回
  status: number
  inviteCode: string
}

export type RegisterParams = {
  phone: string
  password: string
  captcha: string
  inviteCode: string
}

export type UserItem = {
  id: number
  username: string
  phone: string
  avatarUrl: string
  wxOpenid: string
  useNum: string
}

export type UserList = {
  list: UserItem[]
  total: number
  current: number
  pages: number
}

export type UserStatisticsResult = {
  // 统计概览
  overview: {
    totalRevenue: number // 总收入(元)
    totalRefund: number // 总退款(元)
    netRevenue: number // 净收益(元) = 总收入 - 总退款
    totalOrders: number // 订单总数
    successOrders: number // 支付成功订单数
    refundOrders: number // 退款订单数
    successRate: number // 支付成功率(%)
    refundRate: number // 退款率(%)
    activeHotels: number // 活跃酒店数
    activeMachines: number // 活跃机器数量
    activeUsers: number // 活跃用户数
    revenueGrowthRate: number // 收入增长率（%）
    orderGrowthRate: number // 订单增长率（%）
    commissionRate: number // 分成比例（%）
    commissionAmount: number // 分成金额（元）
  }

  // 时间序列统计数据
  timeSeriesData: Array<{
    timeLabel: string // 时间标签 (如: 2025-08-17、2025-W33、2025-08)
    timePoint: string // 时间点
    revenue: number // 收益 (元)
    refund: number // 退款 (元)
    netRevenue: number // 净收益 (元)
    orders: number // 订单数
    successOrders: number // 支付成功订单数
    refundOrders: number // 退款订单数
    activeUsers: number // 活跃用户数
    commissionAmount: number // 分成金额 (元)
  }>

  // 加盟商排名（仅管理员可见
  franchiseeRankings: Array<{
    rank: number // 排名
    franchiseeId: number // 加盟商ID
    franchiseeName: string // 加盟商名称
    revenue: number // 收益 (元)
    refund: number // 退款 (元)
    netRevenue: number // 净收益 (元)
    orders: number // 订单数
    hotelCount: number // 酒店数
    machineCount: number // 机器数
  }>

  // 酒店排行
  hotelRankings: Array<{
    rank: number // 排名
    hotelId: number // 酒店ID
    hotelName: string // 酒店名称
    franchiseeName: string // 加盟商名称
    revenue: number // 收益 (元)
    refund: number // 退款 (元)
    netRevenue: number // 净收益 (元)
    orders: number // 订单数
    machineCount: number // 机器数
  }>

  // 产品排行
  productRankings: Array<{
    rank: number // 排名
    productId: number // 产品ID
    productName: string // 产品名称
    revenue: number // 收益 (元)
    refund: number // 退款 (元)
    netRevenue: number // 净收益 (元)
    orders: number // 订单数
    usageCount: number // 使用次数
  }>
}
