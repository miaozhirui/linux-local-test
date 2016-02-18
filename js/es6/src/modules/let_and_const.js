// let命令
// {
// 	let a = 'miaozhirui';
// 	var b = 'cc'
// }


// console.log(a,b)
// for(var i=0; i<5; i++){};
// for(let i=0; i<5; i++){};

// console.log(i)


// var a = [];
// for(var i=0; i<10; i++){
// 	a[i] = (function(i){

// 		return function(){
// 			   console.log(i);
// 		     } 
// 	})(i)
// }

// a[6]();
// console.log(a)

// var a = [];
// for (let i = 0; i < 10; i++) {
//   a[i] = function () {
//     console.log(i);
//   };
// }
// a[6]();
// 'use strict';
 
// console.log(a);
// console.log(b);

// var a = 1;
// let b = 2; 
// console.log(a)
// ****babel不会报错，但是在node环境中会报错

// var tem = 1;
// if(true){
// 	tem = 1;

// 	let tem = 2;
// }
// console.log(tem)
// ****es6规定暂时性死区和不存在变量提升,主要是减少运行时的错误

// var str = "hello";

// for(let i=0; i<str.length; i++){
// 	console.log(str[i])
// }


// console.log(i)

// {
// 	let name = 1;
// }
// console.log(name)
// {
// 	let miao = 'zhirui';
// 	console.log(miao)
// 	function add(){}
// }

// 'use strict';
// const pi = 1;
// console.log(pi)

// name = 1;
// const name = 1;
// name = 1;
// console.log(name)


// const name
// name = 1;
// console.log(name)

// const name;

// {
// 	console.log(name);
// 	let name = 1;
// }

// const a = [];
// a.push('hello');
// console.log(a.length)
// a = [];

// const a = Object.freeze({});
// a.name = 1;





























































