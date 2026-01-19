// 扁平化数组

const arr = [1, 2, [3, 4, 5], [6, 7, [8, 9, 10]]]

// 使用flat方法
function flat1(arr) {
  return arr.flat(Infinity)
}

// 使用reduce 递归 实现
function flat2(arr) {
  return arr.reduce((acc,item) => {
    Array.isArray(item) ? acc.concat(flat2(item)) : acc.concat(item)
  }, [])
}