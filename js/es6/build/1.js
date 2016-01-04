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

	var _ = __webpack_require__(1);

	var _2 = __webpack_require__(2);

	var _3 = _interopRequireDefault(_2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//1. let var
	// {
	// 	let a = 1;
	// 	var b = 2;
	// }
	// console.log(a,b)

	// 2.for循环的计数器
	// for(let i = 0; i<10; i++){
	// 	console.log(i)
	// }
	// console.log(i)

	// var a = []; 
	// for(let i=0; i<10; i++){
	// 	a[i] = function(){
	// 		console.log(i)
	// 	}
	// } 
	// a[6]() 

	// 3.不存在变量提升
	// console.log(foo);
	// let foo =2;
	// import * as person from './modules/1';
	// // import {say} from './modules/2';  
	// import action from './modules/2'; 
	// console.log(action())
	// console.log(person.firstName, person.lastName, person.year)  

	// 4.模块的整体加载    
	// 5.export default命令

	(0, _3.default)();
	console.log(_.firstName, _.lastName, _.year);
	console.log();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var firstName = 'miao';
	var lastName = 'zhirui';
	var year = 1990;

	exports.firstName = firstName;
	exports.lastName = lastName;
	exports.year = year;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = say;
	function say() {
		console.log(11);
	}

/***/ }
/******/ ]);