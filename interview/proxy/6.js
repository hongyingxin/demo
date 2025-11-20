/*  观察者模式 Observer mode 函数自动观察数据对象，一旦数据对象发生变化，函数会自动执行 */
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}

const person = observable({
  name: 'John',
  age: 20
})

function print() {
  console.log(`${person.name} is ${person.age} years old`)
}

observe(print)

person.name = '李四'
// 李四 is 20 years old