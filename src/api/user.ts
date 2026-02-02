// 用户相关接口
import { request } from '@/utils/request'
import type {
  LoginParams,
  LoginResult,
  UserInfo,
  RegisterParams,
  UserList,
  UserStatisticsResult,
} from '@/api/model/userModel'
import { PermissionRequestBodyType } from './model/permissionModel'

// 登录
export const login = (data: LoginParams) =>
  request.post<LoginResult>({
    url: '/login',
    data,
  })

// 获取用户信息
export const getUserInfo = () =>
  request.get<UserInfo>({
    url: '/user/getInfo',
  })

// 注册
export const register = (data: RegisterParams) =>
  request.post({
    url: '/register',
    data,
  })

// 审批
export const approve = (data: PermissionRequestBodyType) =>
  request.post({
    url: '/permission/approve',
    data,
  })

// 获取权限详情
export const getPermissionDetail = (id: number) =>
  request.get<PermissionRequestBodyType>({
    url: '/permission/detail',
    params: {
      id,
    },
  })

// 获取用户列表
export const getList = (params: { pageNo: number; pageSize: number }) =>
  request.get<UserList>({
    url: '/user/list',
    params,
  })

// 获取用户统计
type UserStatisticsType = 'day' | 'week' | 'month'

// 获取用户统计
export const getUserStatistics = (type: UserStatisticsType = 'month') =>
  request.get<UserStatisticsResult>({
    url: '/api/dashboard/statistics',
    params: {
      statisticsType: type,
    },
  })
