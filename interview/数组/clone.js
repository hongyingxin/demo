// 深拷贝

// 递归拷贝
function deepClone(obj) {
  // 只拷贝对象和数组
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  }
  const newObj = {}
  for (const key in obj) {
    newObj[key] = deepClone(obj[key])
  }
  return newObj
}

// 使用 structuredClone 拷贝
function deepClone2(obj) {
  return structuredClone(obj)
}

// 使用JSON方法拷贝
function deepClone3(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 更精简的递归写法
function deepClone4(obj) {
  return (obj === null || typeof obj !== 'object') ? obj : Array.isArray(obj) ? obj.map(deepClone4) : Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, deepClone4(value)]))
}