export type DeviceItemType = {
  id: number
  productName: string
  productTitle: string
  productId: number
  machineId: number | null
  franchiseeName: string
  hotelName: string
  hotelId: string
  roomNumber: string
  hotelAddress: string
  bindingDataTime: string
  iotProductId: string
  status: number
  price: number
  deposit: number
  machineCode: string
  createTime: string
  updateTime: string
}

export type DeviceListType = {
  list: DeviceItemType[]
  total: number
  current: number
  pages: number
}

export type AddDeviceBodyType = {
  id?: number
  productId: number // 产品id
  hotelId: number // 酒店id
  roomNumber: string // 酒店房间
  machineCode: string // 设备编码
  iotProductId: string // 设备型号
  price: number // 设备价格
  deposit: number // 押金
}

export type UpdateDeviceBodyType = AddDeviceBodyType & {
  id: number
}
