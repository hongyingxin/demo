// 数组去重

const arr = [1, 2, 1, 2, 1, 2]

// 使用Set去重
function unique1(arr) {
  return [...new Set(arr)]
}

// indexOf去重
function unique2(arr) {
  let array = []
  for (let i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i])
    }
  }
  return array
}