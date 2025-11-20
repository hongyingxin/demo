// ============== 进阶题目 ==============
// 考察：函数提升、变量提升、静态方法、实例方法、原型方法、new 运算符优先级

function Bar() {
  this.getName = function() {
    console.log('instance method');
  }
  return this;
}

Bar.getName = function() {
  console.log('static method 1');
}

Bar.prototype.getName = function() {
  console.log('prototype method');
}

var getName = function() {
  console.log('global function');
}

function getName() {
  console.log('function declaration');
}

// 请写出以下输出结果：
Bar.getName();                    // ?
getName();                        // ?
Bar().getName();                  // ?
getName();                        // ?
new Bar.getName();                // ?
new Bar().getName();              // ?
new new Bar().getName();          // ?

