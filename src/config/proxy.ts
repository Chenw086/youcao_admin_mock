export default {
  isRequestProxy: true,
  development: {
    // 开发环境接口请求
    host: '',
    // 开发环境 cdn 路径
    cdn: '',
  },
  test: {
    // 测试环境接口地址
    host: 'https://viviichen.xyz',
    // 测试环境 cdn 路径
    cdn: '',
  },
  release: {
    // 正式环境接口地址
    host: 'https://viviichen.xyz',
    // 正式环境 cdn 路径
    cdn: '',
  },
}
