// 定义ValueWrapper构造函数
function ValueWrapper(value) {
  this.value = value
  this.onChange = null
}
// 添加 setValue 原型方法，用于设置值并触发 onChange 回调
ValueWrapper.prototype.setValue = function(value) {
  this.value = value
  if (typeof this.onChange === 'function') {
    this.onChange(this.value)
  }
}
// 创建 wrapper 实例
const wrapper = new ValueWrapper('hello')
// 创建 Proxy 处理器
const handler = {
  set(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    if (typeof target.onChange === 'function') {
      target.onChange(target.value)
    }
    return true
  },
}
// 创建代理对象
const proxyWrapper = new Proxy(wrapper, handler)
// 设置回调函数，这里触发了handler的set方法
proxyWrapper.onChange = (value) => {
  console.log(`Value changed to ${value}`);
}
// 调用setValue方法
proxyWrapper.setValue('world')
