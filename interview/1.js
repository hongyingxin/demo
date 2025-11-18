// ❌ 错误示例：try-catch 无法捕获异步错误
// try {
//   setTimeout(() => {
//     throw new Error('error')
//   }, 1000)
// } catch (error) {
//   console.log(error)
// }

console.log('=== 四种捕获异步错误的方案 ===\n');

// 方案1：在异步回调内部使用 try-catch
console.log('方案1：在异步回调内部使用 try-catch');
setTimeout(() => {
  try {
    throw new Error('方案1: 异步回调内部捕获的错误');
  } catch (error) {
    console.log('✅ 捕获成功:', error.message);
  }
}, 100);

// 方案2：使用 Promise 的 .catch() 方法
console.log('\n方案2：使用 Promise 的 .catch() 方法');
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('方案2: Promise 中的错误'));
  }, 200);
}).catch(error => {
  console.log('✅ 捕获成功:', error.message);
});

// 方案3：使用 async/await 配合 try-catch
console.log('\n方案3：使用 async/await 配合 try-catch');
async function asyncFunction() {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('方案3: async/await 中的错误'));
      }, 300);
    });
  } catch (error) {
    console.log('✅ 捕获成功:', error.message);
  }
}
asyncFunction();

// 方案4：使用全局错误处理器（process.on('uncaughtException')）
console.log('\n方案4：使用全局错误处理器');
process.on('uncaughtException', (error) => {
  console.log('✅ 全局捕获成功:', error.message);
  console.log('\n注意：全局错误处理器应该作为最后的兜底方案使用');
  process.exit(1); // 捕获后建议退出进程
});

setTimeout(() => {
  throw new Error('方案4: 全局错误处理器捕获的错误');
}, 400);