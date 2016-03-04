/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	// function log(){
	// 	var arg = Array.prototype.slice.call(arguments);
	// 	// console.log(arguments)
	// 	// console.log(arg);
	// 	// arg.forEach(function(i,item){
	// 	// 	console.log(item)
	// 	// })
	// }
	// 1.函数参数的默认值
	// 基本用法
	// function log(x, y = "world"){
	// 	console.log(x,y);
	// }
	// log('hello','miaozhriui')

	// function Point(x = 0, y = 0){
	// 	this.x = x;
	// 	this.y = y;
	// }
	// console.log(new Point());

	// 与解构赋值默认值结合使用
	// function test({x,y=3}){
	// 	console.log(x,y);

	// }
	// // test({x:1,y:3})
	// test({})

	// function fetch(url, {body='', method='GET',headers = {}}){
	// 	console.log(method);
	// }
	// fetch('www.baidu.com',{});//{}必须传入

	// 参数默认值的位置(有参数默认值的最后放在尾部)

	// 函数的length属性
	// console.log((function(a){}).length)
	// log(1,2)

	// function add(x,y,z){
	// 	console.log(x,y,z)
	// }

	// // add(...[1,2,3])
	// add.apply(null,[1,2,3])

	// console.log(...[1,2,3])
	// console.log(Math.max(...[1,23,4,5,6]))
	// console.log(Math.max.apply(null,[1,23,4,5,6]))

	// 2.箭头函数
	// var add = () => { return 1;}
	// console.log(add())
	// const isEvent = n => n%2==0;
	// console.log(isEvent(2))

	var arr = [1, 2, 3];
	var arrs = arr.map(function (x) {
	  return x * x;
	});
	console.log(arrs);

/***/ }
/******/ ]);