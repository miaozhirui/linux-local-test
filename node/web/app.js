var express = require('express');//引入express模块
var path =  require('path');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;//设置监听端口
var app = express();//实例化具体的实例

app.set('views', './app/views/pages');//设置视图的根目录
app.set('view engine', 'jade');//设置视图的默认的引擎
app.use(express.static(path.join(__dirname, 'statics')))
app.listen(port);

// var moveSchema = new mongoose()
console.log('start on port'+port);

require('./config/route')(app)
