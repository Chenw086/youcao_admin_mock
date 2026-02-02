// 权限申请列表
export type PermissionRequest = Array<{
  id: number
  phone: string
  applicationDate: string
  status: number
}>

export type PermissionRequestListType = {
  current: number
  total: number
  list: PermissionRequest
}

export type FranchiseeManageType = {
  id: string
  name: string
  contacts: string
  phone: string
  signingDate: string
  bindingHotelNum: string
}

export type HotelManageType = {
  id: string
  name: string
  contacts: string
  phone: string
  signingDate: string
  address: string
  license: string
  contact: string
}

export type PermissionRequestBodyType = {
  // 加盟商ID
  id: number
  // 操作
  operate: number
  // 名称
  name?: string
  // 联系人
  contacts?: string
  // 联系电话
  contactPhone?: string
  // 比例
  proportion?: number
  // 合同
  contract?: string
  // 地址
  address?: string
  // 营业执照
  license?: string
  // 驳回原因
  rejectReason?: string
  phone?: string
}
