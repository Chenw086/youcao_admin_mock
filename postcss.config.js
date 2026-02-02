import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    pxtorem({
      rootValue(input) {
        // 安全检查：postcss-pxtorem 的 rootValue 回调参数可能不稳定
        // input 可能是 { file: string } 对象，也可能直接是 file 字符串（取决于版本）
        // 这里做兼容处理
        let file = ''
        if (typeof input === 'object' && input !== null && input.file) {
          file = input.file
        } else if (typeof input === 'string') {
          file = input
        }

        // TDesign 移动端组件库基于 375px 设计稿
        // 如果是 TDesign 的文件，rootValue 设为 37.5
        if (file && file.indexOf('vant') !== -1) {
          return 37.5
        }
        // 我们的项目基于 750px 设计稿
        return 75
      },
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.ignore-rem'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
    }),
  ],
}
