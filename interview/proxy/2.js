// ✅ 通过包装对象实现
function ValueWrapper(value) {
  this.value = value
  this.onChange = null
}

const handler = {
  set(target, property, value) {
    console.log(`${property} 从 ${target[property]} 变为 ${value}`)
    target[property] = value
    if (property === 'value' && typeof target.onChange === 'function') {
      target.onChange(value)
    }
    return true
  },
  get(target, property) {
    // 关键：让它表现得像基本类型
    if (property === Symbol.toPrimitive || property === 'valueOf') {
      return () => target.value
    }
    return target[property]
  }
}

const wrapper = new ValueWrapper(10)
const proxyValue = new Proxy(wrapper, handler)

// 设置回调
proxyValue.onChange = (val) => console.log(`值变化了: ${val}`)

// 现在可以像操作基本类型一样
proxyValue.value = 20        // 触发拦截和回调
proxyValue.value = 30        // 再次触发

// 甚至可以在运算中使用（通过 valueOf）
console.log(proxyValue.value + 5)  // 35