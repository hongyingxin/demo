function Foo(){
  Foo.a = function(){
      console.log(1);
  }
  this.a = function(){
      console.log(2)
  }
}


Foo.prototype.a = function(){
  console.log(3);
}

Foo.a = function(){
  console.log(4);
}

// Foo.a被定义为输出4的函数
Foo.a(); //4
let obj = new Foo();
// 创建实例，根据属性查找优先级（实例自身属性>原型属性），所以obj.a输出2，而不是原型上的方法输出3
obj.a(); //2
// 在创建实例过程中，Foo.a被重新赋值
Foo.a(); //1  