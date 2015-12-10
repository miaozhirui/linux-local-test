//一个开店指南，
var http = require('http');//需要一个模块加载一个模块
var url = require('url');
/**
 *
 * @param req请求
 * @param res响应
 */

var menus = [{name:'豆豉烤鱼',unit:'条'},{name:'东波肘子',unit:'只'},{name:'水煮牛头',unit:'头'},{name:'米饭',unit:'碗'},{name:'果粒橙',unit:'瓶'}];
var makeMenu = function(){
    var str = '<ul>';
    menus.forEach(function(menu){
        str+='<li><a href="/'+menu.name+'?unit='+menu.unit+'">'+ menu.name +'</a></li>';
    })
    str+='</ul>';
    return str;
}

//Can't set headers after they are sent.
//如果header已经发给客户端了，那么就不能再设置了
var person = function(req, res){
    var urlObj = url.parse(decodeURIComponent(req.url), true);
    console.log(urlObj)
    res.setHeader('Content-Type','text/html; charset=utf-8');
    if(urlObj.path=='/'){
        //如果响应体已经发出去了，就不能再发相应体了
        res.end(makeMenu());
    } else {
        res.end('客观,一'+urlObj.query.unit+urlObj.pathname.slice(1))

    }
}

//装修一个自己的分店
var server = http.createServer(person);

//开店营业，告诉自己的端口和ip
server.listen(8081,function(){
    console.log('server start')
})

/**
 search: '?name=miaozhirui',url的参数
 query: 'name=miaozhirui',url的参数除去问号
 pathname: '/',请求的路径
 path: '/?name=miaozhirui',请求的全路径
 **/
