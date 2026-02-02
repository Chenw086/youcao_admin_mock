/**
 * 将对象序列化为URL查询字符串，用于替代第三方的 qs 库，节省宝贵的体积
 * 支持基本类型值和数组，不支持嵌套对象
 * @param obj 要序列化的对象
 * @returns 序列化后的查询字符串
 */
export function stringifyQuery(obj: Record<string, unknown>): string {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return ''

  return Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // 对键进行编码
      const encodedKey = encodeURIComponent(key)

      // 处理数组类型
      if (Array.isArray(value)) {
        return value
          .filter((item) => item !== undefined && item !== null)
          .map((item) => `${encodedKey}=${encodeURIComponent(String(item))}`)
          .join('&')
      }

      // 处理基本类型
      return `${encodedKey}=${encodeURIComponent(String(value))}`
    })
    .join('&')
}

/**
 * @param queryString 要反序列化的查询字符串（可以包含或不包含前导问号）
 * @returns 反序列化后的对象
 */
export function parseQuery(queryString: string): Record<string, unknown> {
  if (typeof queryString !== 'string' || queryString.trim() === '') {
    return {}
  }

  // 移除前导的问号（如果存在）
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString

  // 分割查询字符串为键值对数组
  const pairs = cleanQuery.split('&')
  const result: Record<string, unknown> = {}

  for (const pair of pairs) {
    if (!pair) continue // 跳过空字符串

    // 分割键值对
    const [encodedKey, encodedValue] = pair.split('=', 2)
    if (encodedKey === undefined) continue // 跳过无效的键值对

    // 解码键和值
    const key = decodeURIComponent(encodedKey)
    const value = encodedValue !== undefined ? decodeURIComponent(encodedValue) : '' // 处理没有值的情况，如"?key"

    // 处理数组情况
    if (key.endsWith('[]')) {
      const arrayKey = key.slice(0, -2)
      if (!Array.isArray(result[arrayKey])) {
        result[arrayKey] = []
      }
      ;(result[arrayKey] as unknown[]).push(value)
    } else {
      // 处理普通键值对
      result[key] = value
    }
  }

  return result
}
