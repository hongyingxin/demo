// 【面试题】为什么 4 能按顺序输出？
// 关键：return Promise.resolve(4) 会产生额外的微任务！

Promise.resolve()
.then(() => {
  console.log(0)  // 微任务1执行：输出 0
  return Promise.resolve(4)  // ⚠️ 返回一个 Promise，会产生额外的微任务
}).then((res) => {
  console.log(res)  // 微任务N执行：输出 4（会延迟！）
})

Promise.resolve()
.then(() => {
  console.log(1)  // 微任务2执行：输出 1
}).then(() => {
  console.log(2)  // 微任务3执行：输出 2
}).then(() => {
  console.log(3)  // 微任务4执行：输出 3
}).then(() => {
  console.log(5)  // 微任务5执行：输出 5
}).then(() =>{
  console.log(6)  // 微任务6执行：输出 6
})

/* 
执行过程分析：
================

1. 两个 Promise.resolve() 同步执行，各自的第一个 .then() 加入微任务队列
   微任务队列：[微任务1, 微任务2]

2. 执行微任务1：
   - 输出 0
   - return Promise.resolve(4) 
   - ⚠️ 这里的关键：返回一个 Promise 会触发 Promise 的 "thenable" 处理
   - 需要额外的微任务来 unwrap 这个 Promise
   - 此时不会立即将下一个 .then() 加入队列

3. 执行微任务2：
   - 输出 1
   - 将下一个 .then() (输出2) 加入队列
   微任务队列：[微任务3(输出2)]

4. 执行微任务3：
   - 输出 2
   - 将下一个 .then() (输出3) 加入队列
   微任务队列：[微任务4(输出3)]

5. 执行微任务4：
   - 输出 3
   - 将下一个 .then() (输出5) 加入队列
   此时 Promise.resolve(4) 已经被 unwrap，将输出4的回调加入队列
   微任务队列：[微任务5(输出5), 微任务X(输出4)]

6. 执行微任务5：输出 5
   微任务队列：[微任务X(输出4), 微任务6(输出6)]

7. 执行微任务X：输出 4

8. 执行微任务6：输出 6

最终输出：0 1 2 3 5 4 6  ❌ 错了！

实际上，根据规范，return Promise.resolve(4) 会产生 2 个额外的微任务：
- 一个用于 Promise resolve 的处理
- 一个用于 thenable 的 unwrapping

所以实际输出是：0 1 2 3 4 5 6 ✅
*/