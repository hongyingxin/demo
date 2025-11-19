// Reflect.get 的作用详解

console.log('===== 1. Reflect.get 返回的是原值 =====\n')

const originalObj = {
  name: 'Alice',
  age: 25,
  nested: {
    city: 'Beijing'
  }
}

const handler = {
  get(target, prop, receiver) {
    console.log(`📌 拦截到 get 操作: prop = "${prop}"`)
    
    // 方式1: 使用 Reflect.get（推荐）
    const value = Reflect.get(target, prop, receiver)
    console.log(`   Reflect.get 返回:`, value)
    console.log(`   返回的是原始对象引用吗？`, value === originalObj[prop])
    
    return value
  }
}

const proxy = new Proxy(originalObj, handler)

console.log('访问 proxy.name:')
const nameValue = proxy.name

console.log('\n访问 proxy.nested:')
const nestedValue = proxy.nested
console.log('nested 是原始对象吗？', nestedValue === originalObj.nested)


console.log('\n\n===== 2. Reflect.get vs 直接访问的区别 =====\n')

const obj2 = {
  name: 'Bob',
  get fullName() {
    console.log('  📍 fullName getter 中的 this:', this === proxy2 ? 'proxy2' : 'target')
    return this.name + ' Smith'
  }
}

const handler2 = {
  get(target, prop, receiver) {
    console.log(`拦截 "${prop}"`)
    
    // 使用 Reflect.get，会将 receiver (proxy) 作为 this
    // 这样 getter 函数中的 this 指向 proxy，而不是原始对象
    return Reflect.get(target, prop, receiver)
    
    // 如果用 target[prop]，this 会指向原始对象
    // return target[prop]
  }
}

const proxy2 = new Proxy(obj2, handler2)
console.log('调用 proxy2.fullName:')
console.log('结果:', proxy2.fullName)


console.log('\n\n===== 3. 为什么要用 Reflect.get 而不是 target[prop]？ =====\n')

const obj3 = {
  _name: 'Charlie',
  get name() {
    console.log('  getter 中的 this:', this)
    return this._name
  }
}

console.log('❌ 错误方式: 直接用 target[prop]')
const handler3_wrong = {
  get(target, prop) {
    console.log(`拦截 "${prop}"`)
    return target[prop]  // this 会指向原始对象，无法继续拦截
  }
}
const proxy3_wrong = new Proxy(obj3, handler3_wrong)
proxy3_wrong.name  // getter 中的 this 指向原始 obj3


console.log('\n✅ 正确方式: 使用 Reflect.get(target, prop, receiver)')
const handler3_right = {
  get(target, prop, receiver) {
    console.log(`拦截 "${prop}"`)
    return Reflect.get(target, prop, receiver)  // this 会指向 proxy，可以继续拦截
  }
}
const proxy3_right = new Proxy(obj3, handler3_right)
proxy3_right.name  // getter 中的 this 指向 proxy3_right


console.log('\n\n===== 4. 总结 =====\n')
console.log(`
1. Reflect.get 返回的是【原值】（原始对象/原始值），不是 Proxy
2. Reflect.get 的第三个参数 receiver 很重要：
   - 它会作为 getter 函数中的 this
   - 这样可以保证 getter 内部访问其他属性时，也能被 Proxy 拦截
3. 推荐使用 Reflect.get 而不是 target[prop]，因为它能正确处理 this 指向
`)

