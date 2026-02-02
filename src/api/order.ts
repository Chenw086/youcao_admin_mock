import { request } from '@/utils/request'
import { OrderList, QueryOrderParams } from './model/orderModel'

enum API {
  GET_LIST = '/admin/payment/orders',
  GET_USER_LIST = '/order/getByUser',
}

export const getList = (params: QueryOrderParams) =>
  request.get<OrderList>({
    url: API.GET_LIST,
    params,
  })
