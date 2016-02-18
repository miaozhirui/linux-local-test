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

 // import {firstName, lastName, year} from './modules/1';
 // import say from './modules/2'; 

 // say()
 // console.log(firstName, lastName, year);
 //  console.log()
 // import {firstName, lastName} from './modules/export';

 // console.log(firstName, lastName)
 

 // import './modules/export';

// import * as action from './modules/export';
// console.log(action.add(), action.del());

// import de, {del, add} from "./modules/export";

// de();
// del();
// add();


// 6.let和const
// import "./modules/let_and_const";

// 7.箭头函数
import './modules/arrow';












































