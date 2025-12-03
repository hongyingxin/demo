/**
 * Generator 函数是ES6提供的一种异步编程解决方案。
 * 执行 Generator 函数会返回一个遍历器对象，代表Generator函数的内部指针，指向当前的内部状态。
 * 每次调用遍历器对象的 next 方法，会返回一个对象，对象的 value 属性是 yield 表达式后面的值，done 属性为布尔值，表示是否遍历结束。
 * 特征：
 *  1. function 关键字与函数名之间有一个星号
 *  2. 函数体内部使用 yield 表达式，定义不同的内部状态
 */

function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const helloWorld = helloWorldGenerator();

// console.log(helloWorld.next());
// console.log(helloWorld.next());
// console.log(helloWorld.next());

/**
 * next()方法可以带一个参数，该参数会被当作上一个yield表达式的返回值。
 * 注意：由于第一次调用next()方法时，参数会被丢弃，所以第一次调用next()方法时，不能带参数。
 */
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
console.log(a.next()); // yield (x + 1) => 6
console.log(a.next()); // 2 * undefined => NaN
console.log(a.next()); // return (5 + NaN + undefined) => NaN

var b = foo(5);
console.log(b.next()); // yield (5 + 1) => 6
console.log(b.next(12)); // 2 * 12 = 24
console.log(b.next(13)); // return (5 + 24 + 13) => 42

/**
 * for...of 循环可以自动遍历 Generator 函数，因为它在每次迭代时会自动调用 next()方法。
 * 但一旦next()方法返回的对象的done属性为true，for...of循环就会终止，且不包含该返回对象。
 */
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  return 4
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3


/**
 * throw()方法可以在Generator函数内抛出错误，并且在函数体外抛出错误，然后在Generator函数内捕获。
 */

var g = function* () {
  try {
    yield;
  } catch (error) {
    console.log('内部捕获', error);
  }
}

var i = g();
i.next();
try {
  i.throw('a');
  i.throw('b');
  i.throw('c');
} catch (error) {
  console.log('外部捕获', error);
}

// 内部捕获 a
// 外部捕获 b

/**
 * return()方法可以终止Generator函数，并且返回指定的值。
 */

var g = function* () {
  yield 1;
  yield 2;
  yield 3;
}

var i = g();
console.log(i.next());
console.log(i.return(4));
console.log(i.next());

/**
 * next()、throw()、return()的差异
 * next是将yield表达式替换成一个值。
 * throw是将yield表达式替换成一个throw语句
 * return是将yield表达式替换成一个return语句
*/

const g = function* (x, y) {
  let result = yield x + y;
  return result;
}

const gen = g(1, 2);
console.log(gen.next()); // yield (x + y) => 3
console.log(gen.next(1)); // let result = 1 => 1

gen.throw(new Error('error')); // Uncaught Error: error
// 相当于将let result = yield x + y; 替换成 let result = throw new Error('error');

gen.return(2); // let result = return 2 => 2
// 相当于将let result = yield x + y; 替换成 let result = return 2;

/**
 * yield* 表达式，用于在Generator函数内部，调用另一个Generator函数。
 * 从语法角度看，如果yield表达式后面跟的是一个遍历器对象（即Generator函数），需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为yield*表达式。
 */

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// x a b y

/**
 * Generator函数的this
 */

function* fn() {
  this.a = 1;
}

const obj = new fn();
console.log(obj.a);
