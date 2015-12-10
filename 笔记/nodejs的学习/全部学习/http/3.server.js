//一个开店指南，
var http = require('http');//需要一个模块加载一个模块
var url = require('url');
var fs = require('fs');
var mime = require('mime');//是一个工具，实现文件类型和内容类型的转换(就是将文件类型方进去之后，就可以获得内容类型)
/**
 *
 * @param req请求
 * @param res响应
 */

var menus = [{name:'豆豉烤鱼',unit:'条'},{name:'东波肘子',unit:'只'},{name:'水煮牛头',unit:'头'},{name:'米饭',unit:'碗'},{name:'果粒橙',unit:'瓶'}];
var makeMenu = function(){
    var str = '<ul>';
    menus.forEach(function(menu){
        str+='<li><a href="/mu/'+menu.name+'?unit='+menu.unit+'">'+ menu.name +'</a></li>';
    })
    str+='</ul>';
    return str;
}

//Can't set headers after they are sent.
//如果header已经发给客户端了，那么就不能再设置了
var person = function(req, res){
    var urlObj = url.parse(decodeURIComponent(req.url), true);

    if(urlObj.pathname=='/'){
        //如果响应体已经发出去了，就不能再发相应体了
        //1.读取文件
        //2.替换字符串再响应回去

        res.setHeader('Content-Type','text/html; charset=utf-8');
        var content =  fs.readFileSync('menu.html', 'utf-8');
        content = content.replace(/@@@@@@/, makeMenu())
        res.end(content);
    } else if(urlObj.pathname.indexOf('/mu')==0){
        res.end('客观,一'+urlObj.query.unit+urlObj.pathname.slice(1))

    } else if(urlObj.pathname.indexOf('/clock')==0){
        res.end(new Date().toUTCString())
    }else {
        console.log(urlObj.pathname)
        var fileName = urlObj.pathname.slice(1);
        res.setHeader('Content-Type',mime.lookup(fileName));
        var content = fs.readFileSync(fileName, 'utf-8');
        res.end(content)
    }
}

//装修一个自己的分店
var server = http.createServer(person);

//开店营业，告诉自己的端口和ip
server.listen(8082,function(){
    console.log('server start')
})

