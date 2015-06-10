//console.log('nodejs');
//for(var i in console){
//    console.log(i+' '+console[i]);
//}

//for(var i in global){
//    console.log(i+' '+global[i])
//}

//console.log(Object.getOwnPropertyNames(global))
//var http = require('http');
//http.createServer(function(request, response){
//        response.writeHead(200,{"Content-Type": "text/plain"});
//        response.write('hello world');
//        response.end();
//
//}).listen(8080)



var http = require('http');
var fs = require('fs');

exports.start = function() {
    http.createServer(function(request, response) {
        console.log('request receiving');
        fs.readFile('./index.html', function(err,data){
            if(err) throw err;

            response.writeHead(200, {type:'text/plain'});
            response.write(data);
            response.end();
        })
    }).listen(8888)
    console.log('server start');
}





















