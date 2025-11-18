
const value = 'hello'

function ValueWrapper(value) {
  this.value = value
}

const wrapper = new ValueWrapper(value)

const handler = {
  set(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true;
  },
  // get(target, property) {
  //   console.log(`Getting property ${property}`);
  //   return value
  // }
}

const proxyValue = new Proxy(wrapper, handler)

console.log('proxyValue.name',proxyValue.value)
proxyValue.value = 'Jane'
console.log('proxyValue.name1',proxyValue.value)
