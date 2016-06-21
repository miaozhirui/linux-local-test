/**
 *
 */
//实现一个move方法
var fs = require('fs');

function copy(src,dest){
    "use strict";
    var buff = new Buffer(8*1024);

    var srcFd = fs.openSync(src,'r');
    var destFd = fs.openSync(dest,'w');

    do{
        var read = fs.readSync(srcFd,buff,0,buff.length);
        //console.log(read)
        //read是获取到的字节数
        fs.writeSync(destFd,buff,0,read);
    } while(read==buff.length)//当读满8k的时候，继续读

    fs.closeSync(srcFd);
    fs.closeSync(destFd);
}

copy('read.txt', 'read5.txt')

















