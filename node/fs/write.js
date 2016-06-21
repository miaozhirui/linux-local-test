/*
* 1.打开文件
* 2.写入文件
* fd 文件描述符
* buffer buffer对象
* offset 是从缓存区的哪个位置开始读取
* length 读多少个字节
* position 文件的起始位置
* callback
* 3.关闭文件
*
* */
var fs = require('fs');

fs.open('./msg.txt', 'w', function(err,fd){
    "use strict";
    console.log(fd)

    var buffer = new Buffer('猪粪培训');
    fs.write(fd,buffer,6,6,0,function(err,bytesWritten,buff){
        console.log('成功写入了'+bytesWritten+'字节')

        fs.write(fd,buffer,0,6,6,function(err,bytesWritten,buff){
            console.log('成功写入了'+bytesWritten+'字节')
        })
    })
})


