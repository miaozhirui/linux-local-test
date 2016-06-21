/*
* 目录
* */
var fs = require('fs');
//创建目录
/*
*d rwx r-x r-x
* r read 读取 4
* w write 写入 2
* x execute 执行 1
* 所有者
* 所属组
* 其他人
* */

//fs.mkdir('test', 0666, function(err){
//    //0 666所有者，所属组，其他人拥有读和写的权限，前面的0代表八进制的
//    "use strict";
//    console.log(11)
//    if(err){
//        console.error(err)
//    }
//})

//读取此目录下面的所有的文件和文件夹
//fs.readdir('test', function(err,files){
//    "use strict";
//    if(err){
//        console.error(err);
//    } else {
//        console.log(files)
//    }
//})

//查看一个文件活目录详情
/*
* size 文件大小(单位是字节)
* atime access time 最后一次访问时间
* mtime modify time 修改时间
* ctime create time
* birthtime 创建时间
* */
//fs.stat('test', function(err,stat){
//    "use strict";
//    console.log(stat)
//})


//判断文件是否存在
fs.exists('test/file', function(exists){
    "use strict";
    console.log(exists);
})

//从相对路径获取绝对路径
//fs.realpath('test', function(err, realpath){
//    "use strict";
//
//    console.log(realpath);
//})

//重命名文件
fs.rename('test', 'test2',function(){
    "use strict";

})

//截断文件
//var path = './msg.txt';
//
//fs.stat(path, function(err,stat){
//    "use strict";
//    console.log(stat.size);
//
//    fs.truncate(path,6, function(err){
//        fs.stat(path, function(err, stat2){
//            console.log(stat2.size)
//
//        })
//    })
//})


//创建一个目录的时候，要保证他的父目录存在，不然会报错
//创建子目录的时候，要先把父目录创建好
fs.rmdir('test', function(err){
    "use strict";
    console.error(err)
})









