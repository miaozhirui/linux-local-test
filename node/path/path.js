/*
*
*
* */

var fs = require('fs');
var path = require('path');

/**
 *nomalize正常 规范 将非标准路径转化为标准路径
 * 1）解析
 * 2）多个杠转成一个杠
 * 3)windows linux mac 杠 \ /
 * 4)如果是斜杠结尾，则保留
 *
 * */
//console.log(path.normalize('./../a///b//d//../c//a'));

/**
 * join 将多个参数值字符串结合成一个路径字符串
 * */

//console.log(path.join(__dirname, 'a', 'b', '..', 'c'));


/**
 * resolve
 * 以应用程序根目录为起点，根据参数的值解析出一个绝对路径
 * 1.以应用程序根目录为起点
 * 2. .当前目录 ..上级目录
 * 3. 普通字符串代表下一级目录
 * 4. /代表根目录
 * 5. 如果没有参数，返回当前路径
 * */

//console.log(path.resolve());
//console.log(path.resolve('/a', '..', 'b', 'msg','a.txt'));
//console.log(path.resolve('a', '..', 'b', 'msg','a.txt'));


/**
 * relative 获取两个路径之间的相对路径
 * path.relative(from,to)
 * 返回的是在第一个路径里，如何用相对路径去引用第二个路径
 * */

//console.log(path.relative('a', 'b/c.js'));
//a index.js 引用 b c.js;
//script src = "b/c.js;
/**
 * dirname 获取路径所属的目录
 * 目录的话，返回上一级目录
 * 如果是文件的话，放回当前所属的目录
 * */
//console.log(path.dirname(__dirname))


/**
 *basename 获取一个路径的文件名
 * path
 * ext
 * */
//console.log(path.basename('a/b/index.js', '.js'));

/**
 * 获取文件的扩展名
 * */
//console.log(path.extname('a/b/index.js'));

//路径分隔符(获取当前系统的文件分隔符,windows \和mac /下面是不同的)
console.log(path.sep);

//环境变量分隔符(linux下是冒号, window下是分号)
console.log(path.delimiter);





