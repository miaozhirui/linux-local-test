//1.================================函数参数的默认值

//---------基本用法
// function log(x, y=1){
// 	console.log(x, y);
// }
// log(1)
// function Point(x=2, y=4){
// 	let x = 3;
// 	this.x = x;
// 	this.y = y;
// }
// let p = new Point();
// console.log(p);

//----------与解构赋值默认值结合使用
// function foo({x=1, y=2}={}){
// 	console.log(x,y)
// }
// foo()
// function fetch(url, {body='', method="GET", headers = {}}={}){
// 	console.log(method);
// }
// // fetch('http://www.baidu.com',{});
// fetch('http://www.baidu.com')

//----------函数的length属性
// var add = function(a,b=1){}
// console.log(add.length)

//----------作用域
// function f(y=x, x){
// 	console.log(y);
// }
// f(2);

// 应用
// function throwIfMissing(){
// 	throw new Error('missing params');
// }
// function f(x = throwIfMissing()){
// 	console.log(x)
// }
// f({x:1,y:2,z:3});

//2.================================rest参数
// function sum(...arg){
// 	let sum=0;
// 	arg.forEach(item => {
// 		sum += item;
// 	});
// 	return sum;
// }
// console.log(sum(1,2,3,4,5,6,90));
// function push(array, ...values){

// 	values.forEach(item => {
// 		array.push(item);
// 	})
// }
// var a = [];
// push(a,1,2,3,4);
// console.log(a);


//3.=================================扩展运算符

// 1.---------含义













































































