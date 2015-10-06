'use strict';
// 1.function

// function add(){
// 	this.name='miaozhirui';
// 	this.age= 16;
// }
// add.prototype.fullName = function(){
// 	return this.name+this.age;
// }
// var add1 = new add();
// console.log(add1.fullName())
// console.log(add1)

// 2.class

class add{
	constructor(x,y){
		this.name='miaozhirui';
		this.age = '16';
	}

	fullName(){
		return this.name+this.age;
	}

	
}

var add2 = new add();
console.log(add2)

console.log(add2.fullName())