// 1.属性的简洁表示法
// var foo = 'bar';
// var baz = {foo};
// console.log(baz)


// function add(x,y){
// 	return {x,y}
// }
// console.log(add(1,2))

// var o = {
// 	method() {
// 		console.log(11)
// 	},
// 	delete( ){
// 		console.log('delete')
// 	}
// }
// console.log(o)
// o.method()

// var birth = "2000/01/01";
// var person = {
// 	name: '张三',
// 	birth,
// 	hello(){
// 		console.log('hello')
// 	}
// }
// console.log(person);
// person.hello()

// var cart = {
// 	_wheels: 4,
// 	// 取值器和赋值器，这两个命令其实是巧妙的动态设置对象的属性
// 	get wheels(){
// 		return this._wheels;
// 	},
// 	set wheels(s){
// 		this._wheels = s
// 	}
// }

// cart.wheels = 2;
// console.log(cart.wheels);


// 2.属性名表达式
// var lastWord = 'last word';
// var a = {
// 	'first word': 'hello',
// 	[lastWord]: 'world'
// }
// console.log(a)
// console.log(a['first word']);

// var a = {
// 	[false ? 'wo' : 'ni'] (){
// 		console.log(111)
// 	}
// }
// console.log(a)

// 3.方法的name属性
// var person = {
// 	sayName() {
// 		console.log(this.name);
// 	},
// 	// 取值函数，如果取firstName的值的话，会触发这个函数
// 	get firstName() {
// 		console.log('miaozhirui');
// 	}
// 	// 存值函数，要在函数前面加上set命令
// }
// console.log(person.sayName.name);
// person.firstName;

// 4.Object.is()和===行为基本一致
// console.log(Object.is('',0));

// 5.扩展运算符...
let a = {x:1,y:2,z:3};
let b = { ...a };
console.log(b)











































