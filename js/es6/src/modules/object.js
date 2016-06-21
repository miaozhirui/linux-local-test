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
// let a = {x:1,y:2,z:3};
// let b = { ...a };
// console.log(b)

//属性简写
// var foo = 'bar';

// var baz = {
// 	foo,
// 	name: 1,
// 	say(){
// 		console.log('say');
// 	}
// };
// console.log(baz);
// baz.say();

// function say(x,y){
// 	return {x,y}
// }

// console.log(say(1,2))

// 函数简写
// var obj = {
// 	say(){
// 		console.log('say');
// 	}
// }
// obj.say();

// 实际的例子
// var birth = "2013/1/2";
// var person = {
// 	name: 'mizohirui',
// 	birth,
// 	hello(){
// 		console.log('我的名字是', this.name);
// 	}
// }
// console.log(person);
// person.hello();

// 取值器
// var  person = {
// 	_name: 0,

// 	get name(){
// 		return !!this._name ? '真的' : '假的';
// 	},

// 	set name(name){
// 		this._name =name;
// 	}
// }

// console.log(person.name);
// person.name = "miaozhirui";
// console.log(person._name);


//属性名表达式
// var a = 'my';
// let person = {
// 	name:'miaozhirui',
// 	[a+'ge']:123
// }
// console.log(person);

//方法name属性
// function age(){
// }
// console.log(typeof age.name)
// var person = {
// 	name() {
// 		console.log(111)
// 	}
// }
// console.log(person.name.name);

// var target = {a: 1};
// var source1 = {b: 2};
// var source2 = {
// 	c: 3,
// 	say() {
// 		console.log(11)
// 	},
// 	innerObj: {
// 		name:1,
// 		innerObj1: {
// 			name: 'innerObj1'
// 		}

// 	}
// };
// var newTarget = Object.assign({},target, source1, source2);
// console.log(target)
// console.log(newTarget);
// newTarget.say();


// var obj = {};
// Object.defineProperty(obj, 'name', {
// 	value: 'miaozhirui',
// 	writable: false
// })
// console.log(obj);
// obj.name = "miao";


// var source = {
// 	innerObj : {
// 		name: 'miaozhirui'
// 	}
// }

// var obj1 = Object.assign({}, source);

// // console.log(obj1)
// obj1.innerObj['name'] = 'new';

// console.log(source);


//merge

// const merge = (target, ...source) => Object.assign(target, ...source);

// var target = {};
// var source1 = {name: 'miaozhirui'};
// var source2 = {age: 23};

// merge(target, source1, source2);

// console.log(target);

// let obj = {
// 	name: 'miaozhirui'
// }

// console.log(Object.getOwnPropertyDescriptor(obj, 'name'));

// var obj = {
// 	age:11,
// 	name:'miaozhirui', 
// 	say() {

// 	}
// }

// let keys = Object.keys(obj);
// let values = Object.values(obj);
// console.log(values)


















































































