import { request } from '@/utils/request'
import type { AddDeviceBodyType, DeviceListType, UpdateDeviceBodyType } from './model/deviceModel'

enum Api {
  AddDevice = '/machine/add',
  DeviceList = '/machine/list',
  UpdateDevice = '/machine/update',
  UnbindDevice = '/machine/unbind',
  OpenLock = '/machine/start',
}

export const addData = (data: AddDeviceBodyType) =>
  request.post<null>({
    url: Api.AddDevice,
    data,
  })

export const getList = (
  params: { pageNo: number; pageSize: number } = { pageNo: 1, pageSize: 10 },
) =>
  request.get<DeviceListType>({
    url: Api.DeviceList,
    params,
  })

export const updateData = (data: UpdateDeviceBodyType) =>
  request.post<null>({
    url: Api.UpdateDevice,
    data,
  })

export const deleteData = (id: number) =>
  request.post<null>({
    url: `${Api.UnbindDevice}/${id}`,
  })

export const openLock = (id: number) =>
  request.post<null>({
    url: `${Api.OpenLock}/${id}`,
  })
