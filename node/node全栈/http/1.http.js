var http = require('http');
var fs = require('fs');
var mime = require('mime');

/**
 *
 * @param request 请求
 * @param response 响应
 */
function serve(request, response){
    "use strict";
    var url = request.url;
    console.log(url)
    if(url == '/'){
        response.setHeader('Content-Type',"text/html;charset=utf-8");
        //response.setHeader('name','miaozhirui');//设置响应头

        fs.readFile('index.html', function(err,data){

            if(err){

                console.log(err)
            } else {
                response.write(data);//设置响应体

                response.end();
            }
        })
    } else {

      statics(url, response);

    }

}

function statics(url, response){
    "use strict";

    response.setHeader('Content-Type',mime.lookup(url) + ";charset=utf-8");
    //response.setHeader('name','miaozhirui');//设置响应头

    fs.readFile(url.slice(1), function(err,data){

        if(err){

            console.log(err)
        } else {
            response.write(data);//设置响应体

            response.end();
        }
    })
}


//每当有请求来的时候调用serve函数对客户端进行响应
var server = http.createServer(serve);

server.listen(8081, 'localhost');