/*=============== 1 =============== */
function init() {
  var name = 'John'; // name 是 init 创建的局部变量
  function displayName() { // displayName 是闭包，它访问了 init 的局部变量 name
    console.log(name); // 使用在父函数中声明的变量
  }
  displayName();
}
init();


/*=============== 2 =============== */
function makeFunc() {
  const name = 'Mozilla';
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();