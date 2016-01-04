var fs = require('fs');

/*
	nodejs中，使用fs实现文件的读写，目录的创建，变化的监控所有的方法都有同步和异步实现方式
	加sync的都是同步的方法 方法的返回值
	不带sync的都是异步方法 回调
*/
//<Buffer 72 65 61 64>
//同步读取文件
var data = fs.readFileSync('./read.txt',{encoding:'utf8'});
console.log(data);//输出buffer


//异步读取文件
fs.readFile('./read.txt',{encoding:'utf8'}, function(err, data){
	if(err){
		console.error(err);
	} else {
		console.error(data)
	}

})



