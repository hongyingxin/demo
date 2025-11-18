// const value = {
//   name: 'John',
//   age: 30
// }
const value = 'hello'

const handler = {
  set(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true;
  },
  get(target, property) {
    console.log(`Getting property ${property}`);
    return value
  }
}

const proxyValue = new Proxy(value, handler)

// console.log('proxyValue.name',proxyValue.name)
// console.log('proxyValue.age',proxyValue.age)
// proxyValue.name = 'Jane'
// proxyValue.age = 31
// console.log('proxyValue.name1',proxyValue.name)
// console.log('proxyValue.age1',proxyValue.age)

