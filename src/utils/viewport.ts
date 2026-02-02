// 定义 Flexible 接口，包含 dpr、rem、refreshRem、rem2px 和 px2rem 属性和方法
interface Flexible {
  // 设备像素比
  dpr: number
  // 根元素的 REM 单位值
  rem: number
  // 刷新 REM 单位的方法
  refreshRem: () => void
  // 将 REM 单位转换为像素的方法
  rem2px: (d: number | string) => number | string
  // 将像素转换为 REM 单位的方法
  px2rem: (d: number | string) => number | string
}

// 定义 Lib 接口，包含 flexible 属性
interface Lib {
  flexible: Flexible
}

// 扩展 Window 接口，添加 lib、dpr 和 rem 属性
interface WindowWithLib extends Window {
  lib?: Lib
  dpr?: number
  rem?: number
}

// 立即执行函数表达式 (IIFE)，传递 window 对象和 lib 对象
;(function (win: WindowWithLib, lib: Lib) {
  const doc = win.document

  // 获取文档的根元素 <html>
  const docEl = doc.documentElement
  let metaEl = doc.querySelector<HTMLMetaElement>('meta[name="viewport"]')
  const flexibleEl = doc.querySelector<HTMLMetaElement>('meta[name="flexible"]')
  let dpr = 0
  let scale = 0
  // 用于存储定时器的 ID
  let tid: number

  // 获取 flexible 对象，如果不存在则创建一个新的
  const flexible = lib.flexible || (lib.flexible = {} as Flexible)

  // 如果存在 viewport 的 meta 标签，则根据其内容设置 dpr 和 scale
  if (metaEl) {
    console.warn('将根据已有的meta标签来设置缩放比例')

    // 匹配 initial-scale 的值
    const match = metaEl.getAttribute('content')?.match(/initial-scale=([\d.]+)/)
    if (match) {
      // 解析缩放比例
      scale = parseFloat(match[1] || '1')
      // 计算设备像素比
      dpr = Math.round(1 / scale)
    }
  } else if (flexibleEl) {
    // 如果存在 flexible 的 meta 标签，则根据其内容设置 dpr 和 scale
    const content = flexibleEl.getAttribute('content')
    if (content) {
      // 匹配 initial-dpr 的值
      const initialDprMatch = content.match(/initial-dpr=([\d.]+)/)
      // 匹配 maximum-dpr 的值
      const maximumDprMatch = content.match(/maximum-dpr=([\d.]+)/)
      if (initialDprMatch) {
        // 解析初始设备像素比
        dpr = parseFloat(initialDprMatch[1] || '1')
        // 计算缩放比例
        scale = parseFloat((1 / dpr).toFixed(2))
      }
      if (maximumDprMatch) {
        // 解析最大设备像素比
        dpr = parseFloat(maximumDprMatch[1] || '1')
        // 计算缩放比例
        scale = parseFloat((1 / dpr).toFixed(2))
      }
    }
  }

  // 如果没有从 meta 标签中获取到 dpr 和 scale，则根据设备类型和像素比来设置
  if (!dpr && !scale) {
    // 检测是否为 iPhone
    const isIPhone = win.navigator.appVersion.match(/iphone/gi)
    // 获取设备像素比
    const devicePixelRatio = win.devicePixelRatio
    if (isIPhone) {
      // 对于 iPhone，2 倍和 3 倍屏幕分别使用 2 和 3 倍的方案，其余的使用 1 倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2
      } else {
        dpr = 1
      }
    } else {
      // 对于其他设备，使用 1 倍方案
      dpr = 1
    }
    // 计算缩放比例
    scale = 1 / dpr
  }

  // 设置 data-dpr 属性，表示设备像素比
  docEl.setAttribute('data-dpr', dpr.toString())
  if (!metaEl) {
    // 如果不存在 viewport 的 meta 标签，则创建一个并设置其内容
    metaEl = doc.createElement('meta')
    metaEl.setAttribute('name', 'viewport')
    metaEl.setAttribute(
      'content',
      'initial-scale=' +
        scale +
        ', maximum-scale=' +
        scale +
        ', minimum-scale=' +
        scale +
        ', user-scalable=no, viewport-fit=cover',
    )
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl)
    } else {
      const wrap = doc.createElement('div')
      wrap.appendChild(metaEl)
      doc.write(wrap.innerHTML)
    }
  }

  // 刷新 REM 单位值的方法
  function refreshRem(): void {
    // 获取视口宽度
    let width = docEl.getBoundingClientRect().width
    // 限制最大宽度为 540 * dpr， 如果想更宽就修改这里的值
    if (width / dpr > 540) {
      width = 540 * dpr
    }
    // 计算 REM 单位值
    const rem = width / 10
    // 设置根元素的字体大小
    docEl.style.fontSize = rem + 'px'
    // 设置 flexible 对象和 window 的 rem 属性
    flexible.rem = win.rem = rem
  }

  // 监听窗口 resize 事件，重新计算 REM 单位值
  win.addEventListener(
    'resize',
    function () {
      clearTimeout(tid)
      tid = window.setTimeout(refreshRem, 300)
    },
    false,
  )

  // 监听 pageshow 事件，处理页面从缓存恢复的情况
  win.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(tid)
        tid = window.setTimeout(refreshRem, 300)
      }
    },
    false,
  )

  // 设置 body 的字体大小
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px'
  } else {
    doc.addEventListener(
      'DOMContentLoaded',
      function () {
        doc.body.style.fontSize = 12 * dpr + 'px'
      },
      false,
    )
  }

  // 初次刷新 REM 单位值
  refreshRem()

  // 设置 flexible 对象的 dpr 和 rem 属性，并提供工具方法
  flexible.dpr = win.dpr = dpr
  flexible.refreshRem = refreshRem
  flexible.rem2px = function (d: number | string): number | string {
    const val = parseFloat(d.toString()) * this.rem
    if (typeof d === 'string' && d.match(/rem$/)) {
      return val + 'px'
    }
    return val
  }

  flexible.px2rem = function (d: number | string): number | string {
    const val = parseFloat(d.toString()) / this.rem
    if (typeof d === 'string' && d.match(/px$/)) {
      return val + 'rem'
    }
    return val
  }
})(
  window as WindowWithLib,
  (window as WindowWithLib).lib || ((window as WindowWithLib).lib = {} as Lib),
)
