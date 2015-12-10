//一个开店指南，
var http = require('http');//需要一个模块加载一个模块

/**
 *
 * @param req请求
 * @param res响应
 */

var menus = ['豆豉烤鱼','东波肘子','水煮牛头'];
var makeMenu = function(){
    var str = '<ul>';
    menus.forEach(function(menu){
        str+='<li>'+ menu +'</li>';
    })
    str+='</ul>';
    return str;
}

//Can't set headers after they are sent.
//如果header已经发给客户端了，那么就不能再设置了
var person = function(req, res){
    var url = req.url;
    if(url=='/'){
        //如果响应体已经发出去了，就不能再发相应体了
        res.end(makeMenu());
    }
    //console.log(req.method);
    //console.log(req.url);
    //console.log(req.headers);

    //console.log(req)
    res.statusCode = 200;
    res.setHeader('name','miaozhirui');
    res.write('hello');
    res.end();
   // res.write('hello');//向客户端发起请求
   // res.end();//结束这次请求
}

//装修一个自己的分店
var server = http.createServer(person);

//开店营业，告诉自己的端口和ip
server.listen(8080,function(){
    console.log('server start')
})