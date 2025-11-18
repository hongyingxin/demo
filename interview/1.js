foo(typeof a);
function foo(p) {
  console.log(this); // window/undefined
  console.log(p); // 'undefined'
  console.log(typeof b); // before initialization
  let b = 0;
}