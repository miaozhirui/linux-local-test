/*
    认识类
    继承
    访问权限
    封装
    静态属性
    进价技巧
*/
// 1.类的创建
// class Person{
// 	name: string;
// 	age: number;
// 	constructor(name: string, age: number){
// 		this.name = name;
// 		this.age = age;
// 	}
// 	print(){
// 		return this.name + ":" + this.age;
// 	}
// }
// var p = new Person('miao', 12);
// alert(p.print());
// 2.类的继承
// class Person{
// 	name: string;
// 	age: number;
// 	constructor(name: string, age:number){
// 		this.name = name;
// 		this.age = age;
// 	}
// 	tell(){
// 		return this.name+':'+this.age;
// 	}
// }
// class Student extends Person{
// 	school: string;
// 	constructor(school: string){
// 		this.school = school;
// 		super("ime", 8000);
// 	}
// 	tell(){
// 		return this.name + ":" + this.age + ":" + this.school;
// 	}
// }
// var s = new Student('极客学院');
// alert(s.tell());
// 访问修饰符
/*
public
private
*/
// class Person{
// 	name: string;
// 	age: number;
// 	constructor(name:string,age:number){
// 		this.name = name;
// 		this.age = age;
// 	}
// 	print(){
// 		return this.name + ":" +this.age;
// 	}
// }
// class Teacher extends Person{
// 	school: string;
// 	constructor(school:string){
// 		super('miao',12)
// 	}
// 	print(){
// 		return this.name + this.age + this.school;
// 	}
// }
// var t = new Teacher('极客许愿');
// // t.name = 'miao';
// // t.age = 80000;
// // t.school = 'jike'
// // alert(t.print()); 
// console.log(t)
// 封装的实现
// class Hello{
// 	private _age: number;
// 	tell(){
// 		return this._age;
// 	}
// 	get age():number{
// 		return this._age;
// 	}
// 	set age(newage: number) {
// 		if(newage>200 || newage<0){
// 		} else {
// 		}
// 		this._age = newage;
// 	}
// }
// var h = new Hello();
// h.age = 10;
// alert(h.tell());
// static和使用技巧
var Person = (function () {
    function Person() {
    }
    return Person;
})();
