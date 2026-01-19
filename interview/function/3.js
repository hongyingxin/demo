/**
 * 防抖和节流
 * 核心区别：
 * 防抖 (Debounce)：不管事件触发多频繁，只在最后一次触发后的 delay 时间执行一次。类似于“等电梯”，只要有人进，电梯就重新等几秒。
 * 节流 (Throttle)：在一段时间内，无论触发多少次，都只按固定的频率执行一次。类似于“红绿灯”，按固定周期放行。
 */


/**
 * 防抖函数 (Debounce)
 * 原理：在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。
 * 适用场景：搜索框输入查询、窗口大小调整 (resize)。
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数 (Throttle)
 * 原理：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
 * 适用场景：滚动事件 (scroll)、抢购按钮点击、播放进度更新。
 */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 测试代码 (可选)
// const log = debounce(() => console.log('Debounced!'), 500);
// const scroll = throttle(() => console.log('Throttled!'), 1000);

