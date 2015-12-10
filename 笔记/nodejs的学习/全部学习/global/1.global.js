//'use strict'
/**
 * 全局对象
 * global全局变量的宿主
 * 1.global.name全局对象属性
 * 2.未定义直接复制的变量也会变成global属性
 *
 * 全局对象和全局变量的关系
 *
 * 永远 要使用var来定义变量,不然会污染全局变量空间
 * 在模块内部声明的变量属于模块本省，不属于全局变量
 **/

//name = 'miaozhirui';
//global.age=100;
//console.log(global.name)
//console.log(age)
//console.log(global===global.global)
//console.log(global)

//
//var obj = {name:'objname'};
//
//with(obj){//with这个语句的话，就是说传入一个对象，然后想访问里面的属性，直接写就可以了
//    console.log(name);
//}

/**
 * __filename 文件名
 * __dirname
 **/

/**
 * 1.进入全局
 * 声明的变量 var
 * function hello(){}
 *
 * 2.进入一个函数的时候
 * arguments
 * this
 * 参数列表
 */
//console.log(__filename)//都是方法的参数
//console.log(__dirname)
//模块最终会转成这个函数的样子去执行
//function (__filename, __dirname){

//}

/**
 * 进程对象
 * argv[]命令行的参数
 * env.Path 环境变量
 * pid: 98904 程序的进程号
 * chdir: [Function: chdir]修改当前工作目录
 * cwd: [Function: cwd]当前工作目录
 * memoryUsage: [Function: memoryUsage]当前的程序的内存的占用量
 * stdout: [Getter],监听输出
 * stderr: [Getter],
 * stdin: [Getter],监听输入
 * exit: [Function],
 *kill: [Function],杀掉一个进程
 */

//console.log(process)
//命令行参数
//process.argv.forEach(function(item,index){
//    console.log(item,index)
//})

//获取环境变量的值
//console.log(process.env.PATH)

//var enva = process.env.enva;
//
//if(enva=='dev'){
//
//}

//输出当前程序的进程
//console.log(process.pid)

//process.stdin.on('data', function(data){
//    process.stdout.write(data)
//})
//console.log(__dirname)//当前文件所处的工作目录
//console.log(process.cwd())//当前所在的目录
//process.chdir('..');//这个命令可以修改当前所处的目录
//console.log(process.cwd())

/**
 * {
 *  rss: 20926464,
  * heapTotal: 9275392,
  * heapUsed: 3944768
  * }
 */
console.log(process.memoryUsage())



















