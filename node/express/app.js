var express = require('express');

var app = express();

//app.set('view engine' 'ejs');
//express.start指定静态文件的目录
app.use(express.static('/public'));

app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);



//GET请求
app.get('/', function(req, res){
    "use strict";

    res.render('index.html');
    //res.redirect('http://www.baidu.com');
    //res.redirect('login');
})

app.get('/login', function(req, res){
    "use strict";

    res.render('login.html');
})

app.get('/home', function(req, res){
    "use strict";

    res.render('home.html');
})


//POST请求
app.post('/login', function(req, res){
    "use strict";


})









//app.get('/discover', function(req, res){
//    "use strict";
//
//    res.send('发现页面')
//})
//app.get('*', function(req, res){
//    "use strict";
//
//    res.send('404 not find')
//})


app.listen(8888)