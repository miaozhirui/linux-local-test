/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	Object.assign; //给对象添加方法
	Object.keys; //枚举对象里面的key,如果在类里面定义方法的话，是无法枚举出类原型上面的方法的
	Object.getOwnPropertyNames; //获取对象上面的key值
	
	// 传统js定义类=============
	// function Peron (name, age){
	// 	this.name = name;
	// 	this.age = age
	// }
	
	// Peron.prototype.toString = function(){
	
	// 	return '(' + this.name + ',' + this.age + ')';
	// }
	
	// var girl = new Peron('miaozhirui', 19);
	// console.log(girl);
	// es6定义类的方式============
	// class Person{
	
	// 	constructor(name, age) {
	// 		this.name = name;
	// 		this.age = age;
	// 		console.log('constructor')
	// 	}
	
	// 	sayName() {
	// 		console.log(this.name)
	// 		console.log('sayName');
	// 	}
	
	// 	// sayAge() {
	// 	// 	console.log(this.age);
	// 	// }
	// }
	
	// var person1 = new Person('miaozhirui', 18);
	// console.log(person1);
	// person1.sayName()
	//Object.asign===========用来想对象中添加多个方法
	// var obj = {};
	// Object.assign(obj, {
	// 	sayName() { console.log('say name'); },
	// 	sayAge() { console.log('say age'); }
	// })
	// console.log(obj)
	
	//==================向类上面添加方法
	// person1.sayName()
	// Object.assign(Person.prototype, {
	// 	sayName() {console.log('sayname');},
	// 	sayAge() {console.log('sayAge');}
	// })
	
	// person1.sayName();
	// console.log(Person.prototype.constructor === Person);
	
	//===================类中定义的方法都是不可以枚举的
	// var keys = Object.keys(Person.prototype);
	// var keys = Object.getOwnPropertyNames(Person.prototype);
	// keys.forEach(fun=>console.log(fun));
	// console.log(keys)
	
	//===================类的属性名可以是表达式
	// let methodName = 'miaozhirui';
	// class Person{
	// 	constructor(name, age) {
	// 		this.name = name;
	// 		this.age = age;
	// 	}
	// 	[methodName]() {
	// 		console.log('methodName');
	// 	}
	// }
	// const person1 = new Person('miaozhirui', 90);
	// console.log(person1);
	// person1.miaozhirui();
	
	//====================constructor的方法
	
	//类的实例对象
	
	var Person = function Person() {
		// console.log(11)
	
		_classCallCheck(this, Person);
	};
	
	var person1 = new Person();

/***/ }
/******/ ]);
//# sourceMappingURL=1.js.map