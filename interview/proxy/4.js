// proxy 能够监听对象中的对的引用吗

/*
 * Proxy默认只能拦截对象第一层的操作，对于嵌套对象的属性修改无法直接拦截
 * 我们可以通过递归创建Proxy来实现对嵌套对象的属性修改的拦截
 * 当 proxyObj.nestedObj.foo = 'baz' 执行时
 * JavaScript引擎会把这个操作分解成两步，第一步获取 nestedObj 对象，第二步设置 foo 属性
 * 即const temp = proxyObj.nestedObj ，然后 temp.foo = 'baz'
 */

const obj = {
  nestedObj: {
    foo: 'bar'
  }
}

const handler = {
  get(target, prop, receiver) {
    console.log(`🔍 GET 操作: 获取属性 "${prop}"`)
    
    // Reflect.get 的作用：
    // 1. 从 target 对象中获取 prop 属性的【原始值】
    // 2. receiver 参数确保如果属性是 getter，getter 中的 this 指向 proxy 而不是 target
    const value = Reflect.get(target, prop, receiver)
    
    console.log('  ├─ Reflect.get 返回的原始值:',value)
    console.log('  ├─ 这是原始对象引用吗？', value === obj[prop] || value === obj.nestedObj?.foo)
    
    if (typeof value === 'object' && value !== null) {
      console.log(`  └─ "${prop}" 是对象，包装成 Proxy 后返回（这样才能继续拦截）`)
      return new Proxy(value, handler)  // 返回 Proxy 包装的对象
    }
    console.log(`  └─ "${prop}" 不是对象，直接返回原始值: ${value}`)
    return value  // 返回原始值（字符串、数字等）
  },
  set(target, prop, value) {  
    console.log(`✏️  SET 操作: 设置属性 "${prop}" = "${value}"`)
    target[prop] = value
    return true
  }
}

const proxyObj = new Proxy(obj, handler)

console.log('\n===== 开始执行: proxyObj.nestedObj.foo = "baz" =====\n')
proxyObj.nestedObj.foo = 'baz'

console.log('\n===== 分步演示 =====\n')
console.log('步骤1: 获取 nestedObj')
const temp = proxyObj.nestedObj  // 这会触发 get

console.log('\n步骤2: 在获取的对象上设置 foo')
temp.foo = 'new value'  // 这会触发 set

const textObb = {
  name: 'John',
}
const textProxy = new Proxy(textObb, handler)
textProxy.name = 'Jane'